import { GET_PROFILE_INFO } from '../actions/actionTypes';
import { isEmpty } from 'lodash';
import {removeCookie} from "../public/cookie";

export const removeLocalStorage = store => next => action => {
    if(action.type === GET_PROFILE_INFO && isEmpty(action.payload.user)) {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_date');
        localStorage.removeItem('leftMenuState');
        removeCookie('token');
    }
    return next(action);
}