import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'

export const Rooms = new Mongo.Collection('rooms')
 
if (Meteor.isServer) {
  Meteor.publish('rooms', () => Rooms.find())
}

Meteor.methods({
  'rooms.insert'() {
    Rooms.insert({
      createdAt: new Date(),
    })
  },

  'rooms.setMap'(roomId, mapId) {
    check(roomId, String)
    check(mapId, String)

    Rooms.update(roomId, { $set: { mapId } })
  },

  'rooms.toggleMapSegment'(roomId, mapSegmentId, toggle) {
    check(roomId, String)
    check(mapSegmentId, String)

    if (toggle) {
      Rooms.update(roomId, { $addToSet: { mapSegmentIds: mapSegmentId } })
    } else {
      Rooms.update(roomId, { $pull: { mapSegmentIds: mapSegmentId } })
    }
  },

  'rooms.setImprovedInitiativeSlug'(roomId, improvedInitiativeSlug) {
    check(roomId, String)
    check(improvedInitiativeSlug, String)

    Rooms.update(roomId, { $set: { improvedInitiativeSlug } })
  },
})
