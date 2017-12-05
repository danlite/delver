import { Mongo } from 'meteor/mongo'

export const MapSegments = new Mongo.Collection('mapSegments')

if (Meteor.isServer) {
  Meteor.publish('mapSegments', () => MapSegments.find())
}
