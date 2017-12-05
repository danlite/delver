import React, { Component } from 'react'
import MapViewer from './MapViewer'
import MapsList from './MapsList'
import SegmentsListContainer from './SegmentsListContainer'
import { withTracker } from 'meteor/react-meteor-data'
import { Rooms } from '../../api/rooms'
import { Maps } from '../../api/maps'
import { MapSegments } from '../../api/mapSegments'

class RoomContainer extends Component {
  constructor() {
    super()

    this.handleMapChanged = this.handleMapChanged.bind(this)
    this.renderMapSection = this.renderMapSection.bind(this)
    this.renderInitiativeSection = this.renderInitiativeSection.bind(this)
    this.handleImprovedIniativeSlugChanged = this.handleImprovedIniativeSlugChanged.bind(this)
  }

  handleMapChanged(event) {
    const mapId = event.target.value

    Meteor.call('rooms.setMap', this.props.room._id, mapId)
  }

  handleImprovedIniativeSlugChanged(event) {
    const slug = event.target.value

    Meteor.call('rooms.setImprovedInitiativeSlug', this.props.room._id, slug)
  }

  renderMapSection() {
    const { isGm, room } = this.props

    return <div>
      {isGm && <div>
        <h4>Room {room._id}</h4>
        <MapsList onChange={this.handleMapChanged} value={room.mapId} />
        <label>Improved Iniative slug: </label>
        <input type="text" value={room.improvedInitiativeSlug} onChange={this.handleImprovedIniativeSlugChanged} />
      </div>}
      {this.props.map && <div>
        <MapViewer map={this.props.map} segments={this.props.mapSegments} />
        {isGm && <SegmentsListContainer map={this.props.map} room={room} />}
      </div>}
    </div>
  }

  renderInitiativeSection() {
    const { isGm, room } = this.props
    const { improvedInitiativeSlug } = room
    
    return improvedInitiativeSlug ?
      <iframe style={{ width: '100%', height: '100%', border: 0 }} src={`http://improved-initiative.com/${isGm ? 'e' : 'p'}/${improvedInitiativeSlug}`} /> :
      null
  }

  render() {
    const { isGm } = this.props

    if (this.props.loading) {
      return <div>Loading&hellip;</div>
    } else if (this.props.room) {
      const mapSection = this.renderMapSection()
      const initiativeSection = this.renderInitiativeSection()

      return <div style={{ height: '98vh' }}>
        <div style={{ float: isGm ? 'none' : 'left', width: isGm ? '100%' : '75%', height: isGm ? 'auto' : '100%' }}>{mapSection}</div>
        {initiativeSection && <div style={{ float: isGm ? 'none' : 'left', width: isGm ? '100%' : '25%', height: isGm ? '700px' : '100%' }}>{initiativeSection}</div>}
      </div>
    } else {
      return <h1>Room not found!</h1>
    }
  }
}

const TrackedRoomContainer = withTracker(props => {
  const mapsHandle = Meteor.subscribe('maps')
  const roomsHandle = Meteor.subscribe('rooms')
  const mapSegmentsHandle = Meteor.subscribe('mapSegments')
  const loading = !roomsHandle.ready()
  const room = Rooms.findOne({ _id: props.match.params.id })

  const map = room ? Maps.findOne({ _id: room.mapId }) : null
  const mapSegments = room ? MapSegments.find({ _id: { $in: room.mapSegmentIds } }).fetch() : []

  return {
    mapSegments,
    loading,
    room,
    map
  }
})(RoomContainer)

export default TrackedRoomContainer

export const GmRoomContainer = props => <TrackedRoomContainer isGm={true} {...props} />
export const PlayerRoomContainer = props => <TrackedRoomContainer isGm={false} {...props} />
