import { removeCookie, setCookie } from '../public/cookie';
import {REGISTRATION, SIGN_IN} from '../actions/actionTypes';

export const stateToCookie = store => next => action => {
    if(action.type === SIGN_IN || action.type === REGISTRATION) {
        removeCookie('token');
        setCookie('token', action.payload.token ? action.payload.token.access : '');
        setCookie('auth_date', new Date())
    }

    return next(action);
}
