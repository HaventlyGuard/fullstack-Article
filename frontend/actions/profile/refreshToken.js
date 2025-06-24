import {GET_PROFILE_INFO, SIGN_IN} from '../actionTypes';
import HttpProvider from '../../HttpProvider';
import {route} from '../../route';
import {message} from "antd";

export const refreshToken = (token = {}) => (dispatch) => {
    return (
        HttpProvider.auth_post(route.profile.refresh, {"refresh": token.refresh}).then((result) => {
            if (result.access) {
                dispatch({type: SIGN_IN, payload: {token: result}});

                return result;
            } else {
                dispatch({type: SIGN_IN, payload: {token: ''}});

                return false;
            }
        }, (error) => {
            console.error(error);
        })
    )
}