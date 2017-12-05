import React, { Component } from 'react'
import axios from 'axios'
import { MapSegments } from '../../api/mapSegments'
import bowser from 'bowser'

class MapViewer extends Component {
  constructor() {
    super()

    this.state = {
      mapTranslateX: 0,
      mapTranslateY: 0,
      mapScale: 1
    }

    this.updateMapDimensions = this.updateMapDimensions.bind(this)
    this.zoomAndScaleToVisibleSegments = this.zoomAndScaleToVisibleSegments.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateMapDimensions)
    this.zoomAndScaleToVisibleSegments()
    if (bowser.safari || bowser.ios) {
      this.setState({
        suppressAnimation: true
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateMapDimensions)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.segments !== this.props.segments || prevState.mapWidth !== this.state.mapWidth) {
      this.zoomAndScaleToVisibleSegments()
    }
  }

  updateMapDimensions() {
    if (this._mapImageElement) {
      this.setState({ mapWidth: this._mapImageElement.clientWidth, mapHeight: this._mapImageElement.clientHeight })
    }
  }

  zoomAndScaleToVisibleSegments() {
    if (this._visiblePathSvgElement) {
      const { mapWidth, mapHeight } = this.state

      const mapRect = this._mapImageElement.getBoundingClientRect()
      const svgRect = this._visiblePathSvgElement.getBoundingClientRect()
      let pathRect = this._visiblePathSvgElement.getElementsByTagName('path')[0].getBoundingClientRect()

      pathRect.x -= svgRect.x
      pathRect.y -= svgRect.y

      const pathCenter = {
        x: pathRect.x + pathRect.width / 2,
        y: pathRect.y + pathRect.height / 2
      }

      const mapCenter = {
        x: mapWidth / 2,
        y: mapHeight / 2
      }

      const mapScale = Math.min(mapHeight / pathRect.height, mapWidth / pathRect.width)

      this.setState({
        mapTranslateX: mapCenter.x - pathCenter.x,
        mapTranslateY: mapCenter.y - pathCenter.y,
        mapScale
      })
    }
  }

  render() {
    const { mapHeight, mapWidth, mapTranslateX, mapTranslateY, mapScale, suppressAnimation } = this.state
    const clipPathDefinition = this.props.segments && this.props.segments.length ?
      this.props.segments.map(segment => segment.paths.join(' ')).join(' ') :
      null

    return <div className="map-viewer">
      <img  ref={i => this._mapImageElement = i}
            className="map-image"
            src={this.props.map.imageUrl}
            style={Object.assign({
              visibility: clipPathDefinition ? 'visible' : 'hidden',
              transform: ` scale(${mapScale}) translate(${mapTranslateX}px, ${mapTranslateY}px)`
            }, suppressAnimation ? { transition: 'none' } : {})}
            onLoad={this.updateMapDimensions} />
      {mapHeight && mapWidth && !!clipPathDefinition && <svg className="test-overlay" ref={s => this._visiblePathSvgElement = s}>
        <g transform={`scale(${mapWidth}, ${mapHeight})`} clipPathUnits="objectBoundingBox">
          <path d={clipPathDefinition} fill="red" opacity="0" />
        </g>
      </svg>}
      {!!clipPathDefinition && <svg className="clip-paths">
        <clipPath id="current-clip-path" clipPathUnits="objectBoundingBox">
          <path d={clipPathDefinition} />
        </clipPath>
      </svg>}
    </div>
  }
}

export default MapViewer
