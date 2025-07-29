import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {
  useLoadScript
} from "@react-google-maps/api";
import {
  setDefaults,
  geocode,
  RequestType
} from "react-geocode";
import usePlacesAutocomplete from "use-places-autocomplete";
import { MAP_API, MAP_LIBRARY, PAGES } from './utils/constants';
import Book from './components/Book';
import Progress from './components/Progress';
import { useDispatch, useSelector } from 'react-redux';
import appSlice, { getApp } from './store/slice/app.slice';
import { Button, Header, Icon, Modal, ModalActions } from 'semantic-ui-react';

const App = () => {
  setDefaults({ key: MAP_API, language: "en", region: "es", });
  const dispatch = useDispatch()
  const { setOrigin, setMarkers, setLoad } = appSlice.actions
  const { DATA, LOADERS } = useSelector(getApp)
  const { ORIGIN } = DATA
  const { INTERNET_LOAD } = LOADERS

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log(position)

          // GET ADDRESS FROM LAT LNG
          // THEN POPULATE STATE BASED ON CURRENT LOCATION
          geocode(RequestType.LATLNG, `${latitude},${longitude}`)
          .then(({ results }) => {
            const address = results[0].formatted_address;
            dispatch(setOrigin(
              {
                ...ORIGIN,
                LAT: latitude,
                LNG: longitude,
                ADDRESS: address
              }
            ))
          })
          .catch(console.error);

          // UPDATE MAP
          dispatch(setMarkers([{
            lat: latitude,
            lng: longitude
          }]))
        },
        (error) => {
          console.error('Error getting location:', error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(()=>{
    var elem = document.getElementById("root");
    if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
    }
  },[])

  useEffect(()=>{
    console.log("x", navigator);
    if (navigator.connection.effectiveType !== 'offline') {
      console.log("Online");
      dispatch(setLoad({
        ...LOADERS,
        INTERNET_LOAD: true
      }))
    } else {
      dispatch(setLoad({
        ...LOADERS,
        INTERNET_LOAD: false
      }))
    }
  },[])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAP_API,
    libraries: MAP_LIBRARY
  });

  const { init } = usePlacesAutocomplete({
    initOnMount: false, 
  });

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";
  if (isLoaded) init();

  const handleRefresh = () => {
    window.location.reload()
  }

  const renderModalInternet = () => {
    return (
      <Modal
      basic
      onClose={handleRefresh}
      open={!INTERNET_LOAD}
      size='small'
      >
        <Header icon>
          <Icon name='wifi' />
          NO INTERNET CONNECTION
        </Header>
        <ModalActions>
          <Button basic color='red' inverted onClick={handleRefresh}>
            <Icon name='refresh' /> Refresh app...
          </Button>
        </ModalActions>
      </Modal>
    )
  }

  return (
    <div className="App">

    <Router>
      <Switch>
        <Route exact path={PAGES.BOOK} component={Book} />
        <Route exact path={PAGES.PROGRESS} component={Progress} />
      </Switch>
    </Router>

    {renderModalInternet()}

    </div>
  );
}

export default App;
