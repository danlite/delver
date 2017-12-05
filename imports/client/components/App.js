import React, { Component } from 'react'
import HomeContainer from './HomeContainer'
import { PlayerRoomContainer, GmRoomContainer } from './RoomContainer'
import { Router, Route } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

const browserHistory = createBrowserHistory()

const createRoutes = () => 
  <Router history={browserHistory}>
    <div>
      <Route exact path="/" component={HomeContainer} />
      <Route path="/rooms/:id" exact component={PlayerRoomContainer} />
      <Route path="/rooms/:id/gm" component={GmRoomContainer} />
    </div>
  </Router>

export default createRoutes
