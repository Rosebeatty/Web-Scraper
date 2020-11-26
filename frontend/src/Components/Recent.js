import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

export default function Recent(props) {
  const [color, setColor] = React.useState("");
  let links = props.recent.slice(-6)
  return (
    <React.Fragment>
      <Title>Recent</Title>
      { props.loading ? <div>loading</div> :
        props.recent.length > 0 ?
        <Table size="small">
          <TableBody>
            {links.map((url) => (
              <TableRow key={Math.random()}>
                <TableCell id="link" style={{textAlign:"center", cursor:"pointer"}} onClick={() => props.submitURL(url)}><span>{url}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
       : <p>Search a website to add recents</p>
      }
    </React.Fragment>
  );
}