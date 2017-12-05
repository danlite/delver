import { Meteor } from 'meteor/meteor'

Meteor.startup(() => {
  if (Maps.find().count() === 0) {
    Maps.insert({
      name: 'Cragmaw Hideout',
      imageUrl: '/cragmaw-hideout.jpg',
      clippingUrl: '/cragmaw-hideout-path.svg',
    })
  }

  // Maps.calculateSegments(Maps.findOne()._id)
})

// ======
// MODELS
// ======

import { Maps } from '../imports/api/maps'

Maps.schema = new SimpleSchema({
  name: { type: String },
  imageUrl: { type: String },
  clippingUrl: { type: String }
})

import { MapSegments } from '../imports/api/mapSegments'

MapSegments.schema = new SimpleSchema({
  mapId: { type: String },
  name: { type: String, optional: true },
  paths: { type: [String], minCount: 1 }
})

import { Rooms } from '../imports/api/rooms'

Rooms.schema = new SimpleSchema({
  createdAt: { type: Date },
  mapId: { type: String, optional: true },
  mapSegmentIds: { type: [String] },
  improvedInitiativeSlug: { type: [String], optional: true },
})
