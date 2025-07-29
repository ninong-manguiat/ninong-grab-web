import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Divider, Form, FormField, Icon, Image, Input, Label, Message, MessageContent, MessageHeader, Modal, ModalActions, ModalContent, ModalHeader } from 'semantic-ui-react';
import Loc from '../assets/locicon.png'
import { SwipeableButton } from "react-swipeable-button";
import MapComponent from './MapComponent.js'
import LocationSelector from './LocationSelector.js'
import appSlice, { getApp } from '../store/slice/app.slice.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_KEY, API_URL, BOOKINGS, COUNT, getDateTimeNow, META_COUNT, SENDER_NAME, STATUS, STATUS_CODES, VERSION } from '../utils/constants.js';
import {  doc, runTransaction, serverTimestamp } from "firebase/firestore"; 
import { db } from '../firebase';
import { makeID, redirectTo } from '../utils/func.js';

const Book = () => {
    const dispatch = useDispatch()
    const mapRef = useRef();
    const { setMarkers, setCustomerDetails } = appSlice.actions
    const { DATA } = useSelector(getApp)
    const { CUSTOMER_DETAILS, ROUTE_COMPUTATION, ORIGIN, DESTINATION } = DATA
    const { NAME, CONTACT_NUMBER, REMARKS, BOOK_LATER, BOOKING_DATE, BOOKING_TIME } = CUSTOMER_DETAILS
    const [ modal, setModal ] = useState(false)
    const [ confirmLoading, setConfirmLoading ] = useState(false)

    const validateFields = () => {
        console.log(ORIGIN, DESTINATION)
        if(BOOK_LATER)
        return NAME!=='' && CONTACT_NUMBER!=='' && ROUTE_COMPUTATION.ESTIMATE_AMOUNT!=='' && ORIGIN.ADDRESS !== '' && DESTINATION.ADDRESS !== '' && BOOKING_DATE !=='' && BOOKING_TIME!==''
        else
        return NAME!=='' && CONTACT_NUMBER!=='' && ROUTE_COMPUTATION.ESTIMATE_AMOUNT!=='' && ORIGIN.ADDRESS !== '' && DESTINATION.ADDRESS !== ''
    }

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(20);
        dispatch(setMarkers([{
            lat: lat,
            lng: lng
        }]))
    }, []);

    const renderSwipe = () => {
        return (
            <div className="w-[500px] h-[100px]">             
                <SwipeableButton
                    disabled={!validateFields()}
                    onSuccess={handleOnSuccessBook}
                    text="BOOK" 
                    text_unlocked="BOOKING SUBMITTED" 
                    color="#d52e2d" 
                />
            </div>
        )
    }

    const renderAmount = () => {
        return ROUTE_COMPUTATION.ESTIMATE_AMOUNT ?
            <Message icon className='pricing' size='small' negative>
                <Icon name='angle double right' />
                <MessageContent>
                <MessageHeader>{`PHP ${ROUTE_COMPUTATION.ESTIMATE_AMOUNT}`}</MessageHeader>
                This amount is an estimate and may vary depending on the traffic.
                </MessageContent>
            </Message> : <></>
    }

    const handleOnSuccessBook = () => {
        setModal(true)
    }

    const handleFieldChange = (e) => {
        const { value, name } = e.target

        if((name === 'CONTACT_NUMBER' && value.length === 11) ||
            (name === 'NAME' && value.length === 30) || 
            (name === 'REMARKS' && value.length === 180))
            return

        dispatch(setCustomerDetails({
            ...CUSTOMER_DETAILS,
            [name]: value
        }))
    }

    const handleCheckChange = (e,data) => {
        dispatch(setCustomerDetails({
            ...CUSTOMER_DETAILS,
            'BOOK_LATER': data.checked
        }))
    }

    const renderCustomerDetails = () => {
        return (
            <Form>

            <FormField>
            <label>Name</label>
            <Input
                placeholder='Name'
                value={NAME}
                name={'NAME'}
                onChange={handleFieldChange}
            />
            </FormField>

            <FormField>
            <label>Contact Number</label>
            <Input
                label={{ basic: true, content: '+63' }}
                labelPosition='left'
                placeholder='Contact Number'
                value={CONTACT_NUMBER}
                name={'CONTACT_NUMBER'}
                onChange={handleFieldChange}
            />
            </FormField>

            <FormField>
            <label>Remarks</label>
            <Input
                placeholder='Remarks'
                value={REMARKS}
                name={'REMARKS'}
                onChange={handleFieldChange}
            />
            </FormField>

            {
                BOOK_LATER &&
                <>
                <FormField>
                <label>Booking Date</label>
                <Input
                    placeholder='Booking Date'
                    value={BOOKING_DATE}
                    name={'BOOKING_DATE'}
                    onChange={handleFieldChange}
                />
                </FormField>

                <FormField>
                <label>Booking Time</label>
                <Input
                    placeholder='Booking Time'
                    value={BOOKING_TIME}
                    name={'BOOKING_TIME'}
                    onChange={handleFieldChange}
                />
                </FormField>
                </>
            }

            <FormField>
            <Checkbox
                label='Book Later'
                checked={BOOK_LATER}
                name={'BOOK_LATER'}
                onChange={handleCheckChange}
            />
            <br/>
            <p className='version'>{VERSION}</p>
            </FormField>
            </Form>
        )
    }

    const renderModalConfirmation = () => {
        return (
            <Modal
            size={'mini'}
            open={modal}
            onClose={() => {}}
            >
                <ModalHeader>Booking Confirmation</ModalHeader>
                <ModalContent>
                {renderAmount()}
                <p>Before proceeding, please take note of the following:</p>
                <ul>
                    <li>Meter starts from the current location of the assigned driver towards the pinned location.</li>
                    <li>The estimated amount based on the app is not the actual amount of the transaction. The driver will still base on the meter rendered by the taxi.</li>
                    <li>Flagdown rate of 50 pesos</li>
                    <li>13.50 pesos per km</li>
                    <li>2 pesos per minute</li>
                    <li>Just present your valid Senior Citizen and PWD ID, if you wish to avail the 20% discount.</li>
                </ul>
                <p>Should you wish to proceed, just click Confirm</p>
                </ModalContent>
                <ModalActions>
                <Button onClick={() => window.location.reload()}>
                    No
                </Button>
                <Button negative loading={confirmLoading} onClick={handleConfirmBooking}>
                    Confirm
                </Button>
                </ModalActions>
            </Modal>
        )
    }

    const handleConfirmBooking = async() => {
        // UPLOAD TO DB
        try {
            
            let code = `${makeID()}`
            await runTransaction(db, async (transaction) => {
                setConfirmLoading(true)
                const newRef = doc(db, BOOKINGS, code);
                transaction.set(newRef, {
                    ...DATA,
                    STATUS: STATUS_CODES.QUEUE,
                    DATE: getDateTimeNow(),
                    TIMESTAMP: serverTimestamp()
                });
            });

            setTimeout(()=>{
                setConfirmLoading(false)
                redirectTo(code)
            },[1000])

        } catch (e) {
            console.log("Transaction failed: ", e);
        }
    }

    return (
        <div className='book'>

            <div className='map'>
                <MapComponent mapRef={mapRef} />
            </div>

            <div className='scroll-it'>
                <div className='map-fill-up'>
                    <Image src={Loc} size='mini' className='img-loc-icon'/>
                    <div className='search-inputs'>
                        <LocationSelector panTo={panTo} isOrigin={true}/>
                        <Divider section className='sec'/>
                        <LocationSelector panTo={panTo} isOrigin={false}/>
                    </div>
            </div>
            
            <div className='customer-details'>
                {renderCustomerDetails()}
            </div>
            </div>

            <div className='book-btns'>
                {renderAmount()}
                {renderSwipe()}
            </div>
            
            <div className='modals'>
                {renderModalConfirmation()}
            </div>

        </div>
    )
}

export default Book