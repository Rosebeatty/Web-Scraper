import * as React from "react";
import { Switch, Route } from 'react-router-dom';
import "./App.css";
import Dashboard from './Pages/Dashboard';
import { withRouter } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path='/' exact component={Dashboard} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)
