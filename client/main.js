import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
 
import createRoutes from '../imports/client/components/App'
 
Meteor.startup(() => {
  render(createRoutes(), document.getElementById('render-target'))
})