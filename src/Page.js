import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import ResetPwd from './components/pages/ResetPwd';
import App from './App';

export default () => (
    <Router>
        <Switch>
            {/* <Route exact path="/" render={() => <Redirect to="/app/dashboard/index" push />} />         */}
            {/* <Route exact path="/" render={() => <Redirect to="/app/myweb/home" />} />    */}
            <Route path="/app" component={App} />
            <Route path="/404" component={NotFound} />
            <Route path="/resetpwd" component={ResetPwd} />
            <Route path="/" component={Login} />
           
            <Route component={NotFound} />
        </Switch>
    </Router>
)