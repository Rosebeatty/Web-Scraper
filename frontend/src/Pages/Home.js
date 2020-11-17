import React from 'react'

const Home = () => {
        const [loading, SetLoading] = React.useState(false);
        return (
            <div>
                <form>
                    <label>Scrape a website</label>
                    <input type="text"/>
                    <button type="submit" onClick={() => SetLoading(true)}>Scrape</button>
                </form>   
                { loading 
                ? <div>spinner</div>
                : null }  
            </div>
        )
}

export default Home
