/* global google */
import React, { useState, useEffect, useRef } from 'react'
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api'
import { v4 as uuidv4 } from 'uuid'
import { connect } from 'react-redux'
import { addAdressToStore, changeAdressToStore } from '../../store/addressReducer'

const mapStateToProps = (state) => {
  return {
    addressFromStore: state.address
  }
}

const mapContainerStyle = {
  width: "100%",
  height: "100%"
}
const center = {
  lat: 55.825358,
  lng: 49.032368
}
const options = {
  disableDefaultUI: true,
}
const optionsD = {
  suppressMarkers: true
}
let directionsService;



const MapComponent = ({ addressFromStore, changeAdressToStore }) => {

  let startMarker;

  const [markers, setMarker] = useState([])
  const [selectedMarker, setSelectedMarker] = useState(null)
  let [directions, setDirections] = useState(null)

  let dragRef = useRef();
  let mapRef = useRef();

  useEffect(() => {
    setMarker(addressFromStore)
  }, [addressFromStore])

  const closeBalun = () => { setSelectedMarker(null) }

  useEffect(() => {
    const onMapLoad = () => {
      if (markers.length >= 1) {

        directionsService = new google.maps.DirectionsService();
        const routesCopy = markers.map(route => {
          return {
            location: { lat: route.coord.lat, lng: route.coord.lng },
            stopover: true
          };
        });

        const origin =
          routesCopy.length === 1
            ? new google.maps.LatLng(
              routesCopy[0].location.lat,
              routesCopy[0].location.lng
            )
            : routesCopy.shift().location;
        const destination =
          routesCopy.length === 1
            ? new google.maps.LatLng(
              routesCopy[0].location.lat,
              routesCopy[0].location.lng
            )
            : routesCopy.pop().location;

        const waypoints = routesCopy;

        getDirection(origin, destination, waypoints)
      }
      else {
        setDirections(null)
      }
    }
    onMapLoad();
  }, [markers])

  const getDirection = (origin, destination, waypoints) => {
    waypoints.length >= 1
      ? directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: 'DRIVING',
          waypoints: waypoints
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result)

          } else alert('Не удалось построить маршрут. Обновите страницу и попробуйте снова');
        }
      )
      : directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: 'DRIVING'
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result)

          } else alert('Не удалось построить маршрут. Обновите страницу и попробуйте снова');
        }
      );
  }

  const handleDragStart = (item) => {
    startMarker = item
  }

  const handleDragEnd = async (e) => {
    let coord = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    let map = new window.google.maps.Geocoder()
    let latlng = new window.google.maps.LatLng(coord.lat, coord.lng)
    let response = await map.geocode({ latLng: latlng })
    let address = response.results[0].formatted_address
    changeAdressToStore(startMarker, { address, coord })
  }


  return <GoogleMap
    mapContainerStyle={mapContainerStyle}
    zoom={10}
    center={center}
    options={options}
    onGoogleApiLoaded={({ map }) => {
      mapRef.current = map;
    }}
  >
    {markers.map((item, index) =>
      <Marker key={uuidv4()}
        position={{ lat: item.coord.lat, lng: item.coord.lng }}
        onClick={() => setSelectedMarker(item)}
        draggable={true}
        onDragStart={() => handleDragStart(index)}
        onDragEnd={handleDragEnd}
        ref={dragRef}
      />)}

    {selectedMarker ? (
      <InfoWindow
        position={{ lat: selectedMarker.coord.lat, lng: selectedMarker.coord.lng }}
        onCloseClick={closeBalun}
      >
        <div>
          {`${selectedMarker.address}`}
        </div>
      </InfoWindow>
    ) : null}

    {directions !== null && <DirectionsRenderer options={optionsD} directions={directions} />}

  </GoogleMap>
}

export default connect(mapStateToProps, { addAdressToStore, changeAdressToStore })(MapComponent)