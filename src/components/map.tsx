import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const styles: React.CSSProperties = {
  width: '100vw',
  height: 'calc(100vh - 80px)',
  position: 'absolute',
}

const MapboxGLMap: React.FunctionComponent = () => {
  const [map, setMap] = useState(null)
  const mapContainer = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoidnhtYXR0IiwiYSI6ImNrZXlqanVsZjE2dTcyeWw5MXo2MGl2bXkifQ.aYJ7caybvE-W8NGle4p0-w'
    // mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY
    const initializeMap = ({
      setMapFunction,
      mapRef,
    }: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setMapFunction: any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapRef: any
    }) => {
      const newMap = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/vxmatt/ckeymjssl073319o1uc1j0dga', // stylesheet location
        center: [-78.6569, 37.4316],
        zoom: 6,
      })

      newMap.on('load', () => {
        setMapFunction(newMap)
        newMap.resize()
        newMap.addControl(new mapboxgl.NavigationControl())
      })
    }

    if (!map) initializeMap({ setMapFunction: setMap, mapRef: mapContainer })
  }, [map])

  return <div ref={mapContainer} style={styles} />
}

export default MapboxGLMap
