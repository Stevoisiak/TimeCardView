import React from 'react'
import Router from 'react-router'

import DayStream from './ui/DayStream'
import WeekOverview from './ui/TimeOverview.js'
import Main from './ui/Main.js'

import { Resolver } from "react-resolver"
const DefaultRoute = Router.DefaultRoute;
const Link = Router.Link;
const Route = Router.Route;
const RouteHandler = Router.RouteHandler;

import { createRedux } from 'redux'
import { Provider } from 'redux/react'

import * as stores from './stores'

const mountNode = document.getElementById("app");

const redux = createRedux(stores);

class App extends React.Component {
  render() {
    return (
      <Provider redux={redux}>
        { () => <Main /> }
      </Provider>
    )
  }
}

const routes = (
  <Route name="app" handler={App} path="/">
    <DefaultRoute handler={WeekOverview}/>
    <Route name="day" path="day/:date" handler={DayStream} />
  </Route>
);

Router.run(routes, (Handler, state) => {
  const params = state.params;
  Resolver.render(<Handler params={params}/>, mountNode);
});
