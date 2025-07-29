export const getDateTimeNow = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var mnt = today.getMinutes();

    return {
        d: `${mm}-${dd}-${yyyy}`,
        t: `${hh}:${mnt}`
    }
}

export const PAGES = {
    BOOK: "/",
    PROGRESS: "/booking"
}

export const STATUS_CODES = {
    QUEUE: 'QUEUE',
    C1: "Driver Confirmed",
    C2: "Driver is on the way to Client Origin",
    C3: "Driver arrived at Client Origin",
    C4: "Driver is on the way to Client Destination",
    C5: "Driver arrived at Client Destination",
    DONE: 'DONE',
    CANCELLED: 'CANCELLED'
}

export const BOOKINGS = 'bookings'
export const DRIVERS = 'drivers'

export const MAP_API = "AIzaSyCzl1J8n6APBiZTrCHhGwPYE0TAqCQZkI0"
export const MAP_LIBRARY = ['places']

export const FLAGDOWN_RATE = 100.00
export const PER_KM = 13.50
export const PER_MNT = 2.00

export const API_URL = "https://api.semaphore.co/api/v4/messages"
export const API_KEY = "7f77aba8a2b1750baf4dc0a5875657d7"
export const SENDER_NAME = "NinongARVIN"

// DEPLOYMENT CONFIG - TO CHANGE
export const LOCAL = false

// SCRIPT ID
// 5412554287-q2iieun3su8fhjdpr2ntnd43a6jk02mv.apps.googleusercontent.com

// SCRIPT LINK
// https://script.googleapis.com/v1/scripts/AKfycbyb2sNXaq1yO3yDVNtrFJ3SID9sug1RNc6OpdkwLztcDxMEe75SJEShrp4as48UCDvitw:run

// DEPLOYMENT
// AKfycbyb2sNXaq1yO3yDVNtrFJ3SID9sug1RNc6OpdkwLztcDxMEe75SJEShrp4as48UCDvitw

// LIBRARY
// https://script.google.com/macros/library/d/1D-_LKALTZt7-GGKoWewfO0R1sEv27zpuQZqIfyTqjW2t4oEH46rXXgcX/1

// WEB APP
// https://script.google.com/macros/s/AKfycbwjPef5U45N9drYEGP9lw_VSeLfMiPyWppCnmFRc6yUx-JLR9fcL1f-PR1EqJCCBhkC/exec