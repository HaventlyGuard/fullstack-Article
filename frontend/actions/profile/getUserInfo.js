import HttpProvider from '../../HttpProvider';
import {ADD_TOKEN, GET_PROFILE_INFO, GET_USER_INFO} from '../actionTypes';
import {route} from '../../route';
import moment from "moment";

const prepareUserData = result => {
    return {
        ...result,
        full_name: `${result.name} ${result.last_name ?? ''}`,
        email: `${result.email ?? ''}`,
        institustion: `${result.institustion ?? ''}`,
        expertise:`${result.expertise ?? ''}`,
    }
}

export const getUserInfoSide = (dispatch) => {
    return HttpProvider.get("http://localhost").then(
        (result) => {
            if(!result.error) {
                dispatch({type: GET_PROFILE_INFO, payload: {name: "Arti"}});
            }
        },
        (error) => {
            dispatch({type: GET_PROFILE_INFO, payload: {name: "Arti"}});
            console.error(error);
        }
    )
}

export const getUserInfo = () => (dispatch) => {
    return HttpProvider.get(route.profile.user()).then(
        (result) => {
            if (!result.error) {
                // dispatch({type: ADD_TOKEN, payload: {token: token}});
                dispatch({type: GET_USER_INFO, payload: result});
                // dispatch({type: GET_PROFILE_INFO, payload: {user: prepareUserData(result)}});
            }
        },
        (error) => {
            // dispatch({type: GET_PROFILE_INFO, payload: {error: error.message}});
            console.error(error);
        }
    )
}