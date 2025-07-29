import { collection, doc, onSnapshot, runTransaction } from 'firebase/firestore';
import React, { useRef, useCallback, useEffect, useState } from 'react';
import ListComponent from './ListComponent';
import TableComponent from './TableComponent';
import StatusComponent from './StatusComponent';
import { Button, Divider, Grid, GridColumn, GridRow, Header, HeaderSubheader, Icon, Image, List, Message, MessageContent, MessageHeader, Segment, Tab, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import { db } from '../firebase';
import { BOOKINGS, DRIVERS, STATUS_CODES } from '../utils/constants';
import MAP_PLACEHOLDER from '../assets/map-btn3.png';
import LOGO_ICON from '../assets/icon.png';
import { bookAgainRedirect } from '../utils/func';

const Progress = () => {
    const [bookingCode, setBookingCode] = useState('')
    const [bookingData, setBookingData] = useState({})
    const [hasData, setHasData] = useState(false)

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        setBookingCode(code)
    },[])

    useEffect(()=>{
        const keys = Object.keys(bookingData);
        if(keys.length === 0){
            setHasData(false)
        }else{
            setHasData(true)
        }
    },[bookingData])

    useEffect(() => {
        if(bookingCode && bookingCode.length === 6){
            const ref = doc(db, BOOKINGS, bookingCode);
            const unsub = onSnapshot(ref, (docSnapshot) => {
              if (docSnapshot.exists()) {
                setBookingData(docSnapshot.data());
              } else {
                setBookingData(null); 
              }
            });
        
            return () => unsub();
        }
    }, [bookingCode]); 

    const renderQueue = () => {
        const { CUSTOMER_DETAILS, ORIGIN, DESTINATION, DATE, ROUTE_COMPUTATION } = bookingData
        const { NAME, CONTACT_NUMBER, REMARKS } = CUSTOMER_DETAILS
        const { d, t } = DATE
        const { ESTIMATE_AMOUNT } = ROUTE_COMPUTATION
        
        return (
        <>
        <Message floating icon>
            <Icon name='circle notched' loading color='red'/>
            <MessageContent>
            <MessageHeader>Looking for a driver near you...</MessageHeader>
            You may refresh the app..
            </MessageContent>
        </Message>

        <Header as='h3'>
       Booking #{bookingCode}
        </Header>

        <Header as='h3' attached='top'>
       Contact Details
        </Header>
        <Segment textAlign='left' attached>
            <List relaxed>
            <ListComponent h={NAME} sh={CONTACT_NUMBER}/> 
            </List>
        </Segment>

        <Header as='h3' attached='top'>
       Booking Details
        </Header>
        <Segment attached>
            <List relaxed>
                <ListComponent i={'point'} h={ORIGIN.ADDRESS} sh={'Origin'}/> 
                <ListComponent i={'point'} h={DESTINATION.ADDRESS} sh={'Destination'}/> 
                <ListComponent i={'time'} h={`${d} ${t}`} sh={'Booking Date and Time'}/> 
                <ListComponent i={'sticky note outlines'} h={REMARKS} sh={'Remarks'}/>  
                <Divider/>
                <ListComponent i={'tag'} h={ESTIMATE_AMOUNT} sh={'Estimated Amount'}/>
                <br/>
            </List>
        </Segment>

        </>
        )
    }

    const renderStatusChanges = (s) => {
        switch(s){
            case STATUS_CODES.C1: return <StatusComponent h='Please wait for your driver`s call.' sh='You may click the button below to see real-time location of your driver.' />          
            case STATUS_CODES.C2: return <StatusComponent h={STATUS_CODES.C2} sh='Meter starts now.' />  
            case STATUS_CODES.C3: return <StatusComponent h={STATUS_CODES.C3} sh='You may contact the driver.' />  
            case STATUS_CODES.C4: return <StatusComponent h={STATUS_CODES.C4} sh='Enjoy your trip.' />  
            case STATUS_CODES.C5: return <StatusComponent h={STATUS_CODES.C5} sh='Thank you for booking with us.' />          
            default: return ''
        }
    }

    const renderDriver = () => {
        const { DRIVER, ORIGIN, DESTINATION, STATUS } = bookingData

        if(DRIVER){
            const { FIRST_NAME, LAST_NAME, IMG, PLATE_NO, CONTACT_NO, LOC } = DRIVER
            
            return (
                <>
                {
                LOC &&
                    <>
                    {renderStatusChanges(STATUS)}
                    <Header as={'h3'}>
                    </Header>
                    <Image src={MAP_PLACEHOLDER} fluid as="a" href={LOC} target='_blank'/>
                    <Message>
                    <MessageHeader>Trip Details</MessageHeader>
                    <br/>
                    <Grid>
                    <TableComponent sh={bookingCode} h="Booking Code"/>
                    <TableComponent sh={ORIGIN.ADDRESS} h="Origin"/>
                    <TableComponent sh={DESTINATION.ADDRESS} h="Destination"/>
                    </Grid>
                    </Message>
                    
                    </>
                }
                <div className='footer-driver'>
                    
                    <Image size='tiny' src={IMG} avatar circular className='img-footer-driver'/>
                    <Header as='h1' className='mt1'>{PLATE_NO}</Header>
                    <List relaxed>
                        <ListComponent h={`${LAST_NAME}, ${FIRST_NAME}`} sh={'Driver Name'}/> 
                        <ListComponent h={CONTACT_NO} sh={'Contact Number'}/>
                    </List>
                    <Button color='red' icon labelPosition='left' fluid>
                        <Icon name='call' onClick={()=>{window.open(`tel:${CONTACT_NO}`)}}/>
                        CALL DRIVER
                    </Button>
                </div>
                </>
            )
        }else{
            return ''
        }
    }

    const handleBookAgain = () => {
        bookAgainRedirect()
    }

    const renderDone = () => {
        const { DRIVER, CUSTOMER_DETAILS, ORIGIN, DESTINATION, DATE, ROUTE_COMPUTATION } = bookingData

        if(DRIVER && CUSTOMER_DETAILS && DATE && ROUTE_COMPUTATION){
            const { FIRST_NAME, PLATE_NO } = DRIVER
            const { NAME } = CUSTOMER_DETAILS
            const { d, t } = DATE
            const { ESTIMATE_AMOUNT } = ROUTE_COMPUTATION
            return (
                <div className='done'>
                    <Image src={LOGO_ICON} size='small' centered/>
                    <Header as={'h2'}>Thank you for booking with us!</Header>

                    <Message>
                    <MessageHeader>Trip Summary</MessageHeader>
                    <br/>
                    <Grid>
                        <TableComponent sh={bookingCode} h="Booking Code"/>
                        <TableComponent sh={NAME} h="Booked by"/>
                        <TableComponent sh={`${d} ${t}`} h="Date of Booking"/>
                        <TableComponent sh={ESTIMATE_AMOUNT} h="Estimated Amount"/>
                        <TableComponent sh={ORIGIN.ADDRESS} h="Origin"/>
                        <TableComponent sh={DESTINATION.ADDRESS} h="Destination"/>
                        <TableComponent sh={FIRST_NAME} h="Assigned Driver"/>
                        <TableComponent sh={PLATE_NO} h=""/>
                    </Grid>

                    </Message>
                    <Button fluid color='red' onClick={handleBookAgain}>Book again</Button>
                </div>
            )
        }

    }

    const renderCancelled = () => {
        return 'Booking Cancelled'
    }

    const renderHasData = () => {
        const { STATUS } = bookingData

        switch(STATUS){
            case STATUS_CODES.QUEUE: return renderQueue()
            case STATUS_CODES.C1: return renderDriver()
            case STATUS_CODES.C2: return renderDriver()
            case STATUS_CODES.C3: return renderDriver()
            case STATUS_CODES.C4: return renderDriver()
            case STATUS_CODES.C5: return renderDriver()
            case STATUS_CODES.DONE: return renderDone()
            case STATUS_CODES.CANCELLED: return renderCancelled()
            default: return '404 error'
        }
    }

    const renderNoData = () => {
        return ''
    }
    
    return (
        <div className='progress'>
            { hasData ? renderHasData() : renderNoData() }
        </div>
    )
}

export default Progress