import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Maps } from '../../api/maps'

class MapsList extends Component {
  render() {
    return <select disabled={this.props.loading} onChange={this.props.onChange} value={this.props.value}>
      <option value="">Choose a map</option>
      {this.props.maps.map(map => 
        <option key={map._id} value={map._id}>{map.name || map._id}</option>
      )}
    </select>
  }
}

export default withTracker(() => {
  const mapsHandle = Meteor.subscribe('maps')
  const loading = !mapsHandle.ready()

  return {
    loading,
    maps: Maps.find({}).fetch()
  }
})(MapsList)
