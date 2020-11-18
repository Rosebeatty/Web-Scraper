package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/gocolly/colly"
)

func isInternal(parsedLink *url.URL, siteURL *url.URL, link string) bool {
	return parsedLink.Host == siteURL.Host || strings.Index(link, "#") == 0 || len(parsedLink.Host) == 0
}

func ScrapeURL(w http.ResponseWriter, r *http.Request) {
	type Level []string

	type Heading struct {
		Level string
		Count int
	}

	type Link struct {
		url    *url.URL
		status int
	}

	type Response struct {
		External_Links int
		Internal_Links int
		Total_Links    int
		Broken_Links   int
		Links          []string
		Title          string
		Headings       []Heading
		Login          bool
		HTML           []string
	}
	//Verify the param "URL" exists
	URL := r.URL.Query().Get("url")
	if URL == "" {
		log.Println("missing URL argument")
		return
	}
	log.Println("visiting", URL)

	//Create a new collector which will be in charge of collect the data from HTML
	c := colly.NewCollector(
		// Allow visiting the same page multiple times
		// colly.AllowURLRevisit(),
		// // Allow crawling to be done in parallel / async
		colly.Async(true),
		colly.MaxDepth(2),
	)

	c.Limit(&colly.LimitRule{
		DomainGlob: "*",
		// Set delay between requests to these domains
		Delay: 1 * time.Second,
		// Add additional random delay
		RandomDelay: 1 * time.Second,
		Parallelism: 2,
	})

	var response = []Response{}
	res := Response{}
	detailCollector := c.Clone()
	//Find page title
	c.OnHTML("title", func(e *colly.HTMLElement) {
		res.Title = e.Text
	})

	//Find each heading count
	headings := []Heading{}
	c.OnHTML("html", func(e *colly.HTMLElement) {
		levels := Level{"h1", "h2", "h3", "h4", "h5", "h6"}
		for _, lvl := range levels {
			heading := Heading{}
			heading.Level = lvl
			e.DOM.Find(lvl).Each(func(i int, s *goquery.Selection) {
				heading.Count++
			})
			headings = append(headings, heading)
		}
		//Check if webpage requires login
		if e.DOM.Find("input[type='password']").Length() > 0 {
			res.Login = true
		} else {
			res.Login = false
		}
	})

	// Count external and internal links
	siteURL, parseErr := url.Parse(URL)
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Request.AbsoluteURL(e.Attr("href"))
		parsedLink, parseLinkErr := url.Parse(link)
		if parseErr != nil {
			log.Fatalln(parseErr)
		}
		if parseLinkErr == nil && link != "" {
			if isInternal(parsedLink, siteURL, link) {
				res.Internal_Links++
				res.Total_Links++
			} else {
				res.External_Links++
				res.Total_Links++
			}
		}
		detailCollector.Visit(link)
		if link != "" {
			res.Links = append(res.Links, link)
		}
	})

	detailCollector.OnResponse(func(r *colly.Response) {
		// w.Write(r.Body)
		res.HTML = append(res.HTML, string(r.Body))
		link := Link{
			url:    r.Request.URL,
			status: r.StatusCode,
		}
		fmt.Println(link.status)
	})
	// Error handler
	detailCollector.OnError(func(r *colly.Response, err error) {
		res.Broken_Links++
		fmt.Println("Request URL:", r.Request.URL, "failed with response:", r, "\nError:", err)
	})

	//Command to visit the website
	c.Visit(URL)
	c.Wait()
	detailCollector.Wait()

	res.Headings = headings
	response = append(response, res)
	b, err := json.Marshal(response)
	if err != nil {
		log.Println("failed to serialize response:", err)
		return
	}
	// Add header and write body for endpoint
	w.Header().Add("Content-Type", "application/json")
	w.Write(b)
}
