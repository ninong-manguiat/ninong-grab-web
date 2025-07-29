import React, { useState } from 'react';
import { Header, HeaderSubheader, Input } from 'semantic-ui-react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useDispatch, useSelector } from 'react-redux';
import appSlice, { getApp } from '../store/slice/app.slice';

const LocationSelector = ({panTo, isOrigin}) => {
    const dispatch = useDispatch()
    const { setData } = appSlice.actions
    const { DATA } = useSelector(getApp)
    const { ORIGIN, DESTINATION } = DATA
    const { ADDRESS, ON_SEARCHING } = isOrigin ? ORIGIN : DESTINATION
    const {
        value,
        suggestions: { data },
        setValue,
        clearSuggestions
      } = usePlacesAutocomplete({
        requestOptions: {
          location: { lat: () => 43.6532, lng: () => -79.3832 },
          radius: 100 * 1000
        },
        debounce: 300
      });

      const ref = useOnclickOutside(() => {
        clearSuggestions();
      });

      const handleInput = e => {
        setValue(e.target.value);
      };
    
      const handleSelect = async address => {
        const ad = address.description

        setValue(ad);
        
        // GET LAT LNG BASED ON ADDRESS
        // POPULATE TO MAP MARKER AND ORIGIN STATE
        try {
          const results = await getGeocode({ address: ad });
          const { lat, lng } = await getLatLng(results[0]);
          
          dispatch(setData({
              ...DATA,
              [isOrigin ? 'ORIGIN' : 'DESTINATION']: {
                LAT: lat,
                LNG: lng,
                ADDRESS: ad,
                ON_SEARCHING: true
              }
          }))

          panTo({ lat, lng });
        } catch (error) {
          console.log("😱 Error: ", error);
        }

        clearSuggestions();
      };

      const handleChangeLocation = () => {
        dispatch(setData({
          ...DATA,
          [isOrigin ? 'ORIGIN' : 'DESTINATION']: {
            ...(isOrigin ? ORIGIN : DESTINATION),
            ON_SEARCHING: false
          }
          
        }))
      }

      const renderText = () => {
        return (
          <Header as='h5' className='lft' onClick={handleChangeLocation}>
          {ADDRESS}
            <HeaderSubheader>
            Click to edit {isOrigin ? 'origin' : 'destination'}
            </HeaderSubheader>
          </Header>
        )
      }

      const renderLoc = () => {
        return (
          <>
            <Input 
                placeholder={isOrigin ? 'Origin' : 'Destination'}
                value={value}
                onChange={handleInput}
                fluid
                action={
                  isOrigin ?
                  {
                  icon: 'crosshairs',
                  onClick: () => 
                    window.location.reload()
                  } : null
                }
            /> 
            {data.length > 0 && (
                <ul className="custom-list">
                {data.map((suggestion, index) => {
                    return (
                    <li
                        key={index}
                        className="custom-list-item"
                        onClick={() => handleSelect(suggestion)}
                    >
                        {suggestion.description}
                    </li>
                    );
                })}
                </ul>
            )}
          </>
        )
      }

      return (
        <div className="search" ref={ref}>
            {!ON_SEARCHING ? renderLoc() : renderText()}
        </div>
      );
}

export default LocationSelector;