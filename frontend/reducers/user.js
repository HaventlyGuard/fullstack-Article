import * as types from "../actions/actionTypes"
import {HYDRATE} from 'next-redux-wrapper';
import {UPDATE_USER_INFO} from "../actions/actionTypes";

const initialState = {
    data: {},
}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case types.GET_USER_INFO:
            return {
                ...state,
                data: action.payload,
            }

        case types.UPDATE_USER_INFO:
            return {
                ...state,
                data: action.payload,
            }

        case types.LOGOUT_USER:
            return {
                ...state,
                data: {},
            }
        case HYDRATE:
            return {...state, ...action.payload};

        default:
            return state;
    }
}
