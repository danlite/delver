import React, { Component } from 'react'
import { Rooms } from '../../api/rooms'
import { Meteor } from 'meteor/meteor'

class HomeContainer extends Component {
  constructor() {
    super()

    this.handleCreateRoomClicked = this.handleCreateRoomClicked.bind(this)
  }

  handleCreateRoomClicked() {
    Meteor.call('rooms.insert')
  }

  render() {
    return <ul>
      <li><button onClick={this.handleCreateRoomClicked}>Create a room</button></li>
      <li>Join a room</li>
    </ul>
  }
}

export default HomeContainer
