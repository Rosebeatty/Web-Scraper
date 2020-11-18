import React from 'react';
import Title from './Title';

export default function Headings(props) {
  return (
    <React.Fragment>
      <Title>Heading Count</Title>
      { props.loading ? <div>loading</div> :
        props.heading.length > 0 ?
          props.heading.map(e => <h5 style={{margin:"1.25em auto"}} key={Math.random()}><span>{e.Level}: {e.Count}</span></h5> )
        : <p>Search a website to scrape data</p> }
    </React.Fragment>
  );
}