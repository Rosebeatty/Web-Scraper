import React from 'react';
import Title from './Title';

export default function HTML(props) {
  return (
    <React.Fragment>
      <Title>HTML Version</Title>
      { props.loading ? <div>loading</div> :
        props.html ?
         <p>{props.html}</p> 
        : <p>Search a website to scrape data</p>
      }
    </React.Fragment>
  );
}