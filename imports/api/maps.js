import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import axios from 'axios'
import xpath from 'xpath'
import { DOMParser } from 'xmldom'

import { MapSegments } from './mapSegments'

export const Maps = new Mongo.Collection('maps')

if (Meteor.isServer) {
  Meteor.publish('maps', () => Maps.find())

  Maps.calculateSegments = (mapId) => {
    const map = Maps.findOne({ _id: mapId })
    axios.get(Meteor.absoluteUrl() + map.clippingUrl)
      .then(response => {
        const xml = response.data
        const doc = new DOMParser().parseFromString(xml)
        const clipPaths = xpath.select('//*[local-name()="clipPath"]', doc)
        clipPaths.forEach(clipPath => {
          const name = xpath.select('string(*[local-name()="desc"])', clipPath) || null
          const paths = xpath.select('*[local-name()="path"]/@d', clipPath).map(d => d.value)

          MapSegments.insert({ mapId, name, paths })
        })
      })
  }
}
