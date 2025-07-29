
import { createSlice } from '@reduxjs/toolkit';

const defaultLAT = 14.186561127075116
const defaultLNG = 121.11035114905465

const initialState = {
    DATA: {
        MARKERS: [{
            lat: defaultLAT,
            lng: defaultLNG
        }],
        ORIGIN: {
            LAT: '',
            LNG: '',
            ADDRESS: '',
            ON_SEARCHING: true
        },
        DESTINATION: {
            LAT: '',
            LNG: '',
            ADDRESS: '',
            ON_SEARCHING: true
        },
        ROUTE_COMPUTATION: {
            DISTANCE: 0,
            TIME: 0,
            ESTIMATE_AMOUNT: 0 
        },
        CUSTOMER_DETAILS: {
            NAME: '',
            CONTACT_NUMBER: '',
            REMARKS: '', 
            BOOK_LATER: false,
            BOOKING_DATE: '',
            BOOKING_TIME: ''
        }
    },
    LOADERS: {
        IS_LOADED: false,
        LOAD_ERROR: false,
        NAVIGATOR_LOAD: false,
        INTERNET_LOAD: false
    },
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setData: (state, action) => ({ 
            ...state,
            DATA: action.payload
        }),
        setOrigin: (state, action) => ({ 
            ...state,
            DATA: {
                ...state.DATA,
                ORIGIN: action.payload
            }
        }),
        setDestination: (state, action) => ({ 
            ...state,
            DATA: {
                ...state.DATA,
                DESTINATION: action.payload
            }
        }),
        setMarkers: (state, action) => ({ 
            ...state,
            DATA: {
                ...state.DATA,
                MARKERS: action.payload
            }
        }),
        setRouteComputation: (state, action) => ({ 
            ...state,
            DATA: {
                ...state.DATA,
                ROUTE_COMPUTATION: action.payload
            }
        }),
        setCustomerDetails: (state, action) => ({ 
            ...state,
            DATA: {
                ...state.DATA,
                CUSTOMER_DETAILS: action.payload
            }
        }),
        setLoad: (state, action) => ({ 
            ...state,
            LOADERS: action.payload
        }),
    }
})

export const getApp = (state) => state.app;
export default appSlice;
