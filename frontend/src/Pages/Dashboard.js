import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgressWithLabel from '../Components/CircularProgressWithLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
// import { mainListItems, secondaryListItems } from './listItems';
import Chart from '../Components/Chart';
import Headings from '../Components/Headings';
import Recent from '../Components/Recent';
import HTML from '../Components/HTML';
import Login from '../Components/Login';
import axios from 'axios'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://material-ui.com/">
        Web Scraper
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    minHeight:150
  },
  fixedHeight: {
    height: 345,
  },
  fixedHeightT: {
    height: 250,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [heading, setHeadings] = React.useState([]);
  const [login, setLogin] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [urls, setURLs] = React.useState([]);
  const [input, setInput] = React.useState([]);
  const [upload, setUpload] = React.useState(0);
  const [complete, setComplete] = React.useState(false);
  const [html, setHTML] = React.useState('');
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaperT = clsx(classes.paper, classes.fixedHeightT);

  const sendData = async (e) => {
      e.preventDefault()
      urls.push(input)
      await axios.post(`http://127.0.0.1:8080/search?url=${input}`)
        .then(res => {
            setData(
            [
                {name:"Internal", value: res.data[0].Internal_Links},
                {name:"External", value: res.data[0].External_Links},
                {name:"Broken", value: res.data[0].Broken_Links},
                // {name:"Total", value: res.data[0].Total_Links},
            ])
            setLogin(res.data[0].Login)
            setHeadings(res.data[0].Headings)
            setHTML(res.data[0].HTML)
            setLoading(false)
            setComplete(true)
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
  }

  const handleInput = (e) => {
    setInput(
        e.target.value
    )
}

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar className={classes.toolbar}>
               <Typography  variant="h6" color="inherit" style={{display:"inline-block"}} >
                  Web Scraper       
               </Typography>
          <form className={classes.title} onSubmit={e =>sendData(e)}>
              <label style={{display:"none"}}></label>
              <input onChange={handleInput} value={input} placeholder="Search any website URL" type="url" style={{padding:"0.6em", width:"35vw"}}/>
              <button style={{padding:"0.6em"}} type="submit" onClick={()=> setLoading(true)}>Search</button>
          </form>
          { loading ?
          <IconButton>
                <CircularProgressWithLabel value={upload}/>
          </IconButton>
          : <IconButton>
                    <CircularProgress style={{color:"transparent"}} value={100} variant="determinate"/> 
                    { complete ?
                        <Typography variant="caption" component="div" style={{color:"white"}}>{`${Math.round(
                        100,
                        )}%`}
                        </Typography>
                        : <Typography variant="caption" component="div" style={{color:"white"}}>{`${Math.round(
                        0,
                        )}%`}
                        </Typography>
                    }
            </IconButton>
        }
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart login={login} loading={loading} data={data} style={{display:"flex", justifyContent:"center"}} />
              </Paper>
            </Grid>
            {/* Heading Count */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Headings heading={heading} />
              </Paper>
            </Grid>
            {/* HTML */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaperT}>
                <HTML html={html} style={{display:"flex", justifyContent:"center"}} />
              </Paper>
            </Grid>
            {/* Login */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaperT}>
                <Login login={login} />
              </Paper>
            </Grid>
            {/* Recent Searches */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Recent recent={urls} />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}