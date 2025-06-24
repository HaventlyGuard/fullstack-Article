import HttpProvider from '../../HttpProvider';
import {GET_USER_RULES} from '../actionTypes';
import {route} from '../../route';

export const getUserRules = () => (dispatch) => {
    return HttpProvider.auth(route.profile.rules).then(
        (result) => {
            if (!result.error) {
                dispatch({type: GET_USER_RULES, payload: {userRules: result}});
            }
        },
        (error) => {
            console.error(error);
        }
    )
}