import { LOCAL } from "./constants";

export const makeID = () => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const redirectTo = (code) => {
    let domain = `http://localhost:3000/booking?code=${code}`

    if(!LOCAL){
        domain = `https://ninong-grab.com/booking?code=${code}`;
    }

    window.location.href = domain
}

export const bookAgainRedirect = () => {
    let domain = `http://localhost:3000`

    if(!LOCAL){
        domain = `https://ninong-grab.com`;
    }

    window.location.href = domain
}