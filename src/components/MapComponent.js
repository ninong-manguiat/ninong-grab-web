import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GoogleMap,
    Marker,
    InfoWindow,
    DirectionsService,
    DirectionsRenderer
} from "@react-google-maps/api";
import appSlice, { getApp } from '../store/slice/app.slice';
import { FLAGDOWN_RATE, MAP_API, MAP_LIBRARY, PER_KM, PER_MNT } from '../utils/constants';

const MapComponent = ({
    mapRef
}) => {
    const dispatch = useDispatch()
    const { setMarkers, setRouteComputation } = appSlice.actions
    const { DATA } = useSelector(getApp)
    const { MARKERS, ORIGIN, DESTINATION, ROUTE_COMPUTATION } = DATA

    const [selected, setSelected] = useState(null);

    const onMapLoad = useCallback(map => {
        mapRef.current = map;
    }, []);

    // const onMapClick = useCallback(e => {
    //     setMarkers(current => [
    //       {
    //         lat: e.latLng.lat(),
    //         lng: e.latLng.lng(),
    //         time: new Date()
    //       }
    //     ]);
    // }, []);

    useEffect(()=>{
        if(ORIGIN.ADDRESS && DESTINATION.ADDRESS){
            calculateRoute()
        }
    },[ORIGIN, DESTINATION])

    const [directions, setDirections] = useState(null);
    
    const calculateRoute = () => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: { lat: ORIGIN.LAT, lng: ORIGIN.LNG }, 
            destination: { lat: DESTINATION.LAT, lng: DESTINATION.LNG }, 
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              if(result.routes.length > 0 && result.routes[0].legs.length > 0){
                setDirections(result);

                let dis = result.routes[0].legs[0].distance.value
                let time = result.routes[0].legs[0].duration.value

                dispatch(setRouteComputation({
                  ...ROUTE_COMPUTATION,
                  DISTANCE: dis,
                  TIME: time,
                  ESTIMATE_AMOUNT: calculateAmount(dis, time)
                }))
                
              }else{
                console.log('no routes')
              }
            } else {
              console.error(`error fetching directions ${result}`);
            }
          }
        );
    };

    const calculateAmount = (d,t) => {
        return (FLAGDOWN_RATE + ((d/1000)*PER_KM) + ((t/60)*PER_MNT)).toFixed(2)
    }

    
    return (
        <GoogleMap
            id="map"
            mapContainerStyle= {{ height: "200px", width: "100%" }}
            zoom={15}
            center={{lat: MARKERS[0].lat, lng: MARKERS[0].lng}}
            options={{ disableDefaultUI: true, zoomControl: true }}
            // onClick={onMapClick}
            onLoad={onMapLoad}
        >

            {MARKERS.map(marker => (
                <Marker
                    key={`${marker.lat}-${marker.lng}`}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => {
                        setSelected(marker);
                    }}
                />
            ))}

            {directions && <DirectionsRenderer directions={directions} />}

            {selected ? (
            <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
                setSelected(null);
            }}
            >
                <div>
                <h2>
                    <span role="img" aria-label="bear">
                    🐻
                    </span>{" "}
                    Alert
                </h2>
                </div>
            </InfoWindow>
            ) : null}
        </GoogleMap>
    )
}

export default MapComponent;