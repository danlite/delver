import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { MapSegments } from '../../api/mapSegments'

class SegmentsListContainer extends Component {
  constructor() {
    super()

    this.handleSegmentToggle = this.handleSegmentToggle.bind(this)
  }

  handleSegmentToggle(event) {
    const segmentId = event.target.value
    const checked = event.target.checked

    Meteor.call('rooms.toggleMapSegment', this.props.room._id, segmentId, checked)
  }

  render() {
    const roomMapSegmentIds = this.props.room.mapSegmentIds || []
    return <ul>
      {this.props.segments.map(segment => <li key={segment._id}>
        <label>
          <input type="checkbox" value={segment._id} checked={roomMapSegmentIds.includes(segment._id)} onChange={this.handleSegmentToggle} />
          {segment.name}
        </label>
      </li>)}
    </ul>
  }
}

export default withTracker(props => {
  const { room, map } = props
  const mapSegmentsHandle = Meteor.subscribe('mapSegments')
  const loading = !mapSegmentsHandle.ready()

  const segments = MapSegments.find({ mapId: map._id }).fetch()

  return {
    loading,
    segments
  }
})(SegmentsListContainer)
