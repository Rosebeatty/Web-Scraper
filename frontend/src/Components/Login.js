import React from 'react';
import Title from './Title';

export default function Login(props) {
  return (
    <React.Fragment>
      <Title>Login</Title>
      { props.loading ? <div>loading</div> :
        props.login === true ?
            <p><b>Required</b> <br/>This may impact the number of accessible links</p> : props.login === false ? <p><b>Not Required</b></p>
        : <p>Search a website to scrape data</p>
      }
    </React.Fragment>
  );
}