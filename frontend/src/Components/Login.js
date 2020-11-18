import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Login(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Login</Title>
      <p>{props.Login}</p>
    </React.Fragment>
  );
}