// import { LEFT_MENU_STATE, SIGN_IN } from "../actions/actionTypes"

// export const stateToLocalStorage = store => next => action => {
//     if(action.type === SIGN_IN) {
//         localStorage.setItem('token', JSON.stringify(action.payload.token))
//         localStorage.setItem('auth_date', new Date())
//     }
//     return next(action)
// }

import { LEFT_MENU_STATE, SIGN_IN, REGISTRATION } from "../actions/actionTypes"

export const stateToLocalStorage = store => next => action => {

    switch (action.type) {
        case SIGN_IN :
            localStorage.setItem('token', JSON.stringify(action.payload.token))
            localStorage.setItem('auth_date', new Date())
            break

        case REGISTRATION :
            localStorage.setItem('token', JSON.stringify(action.payload.token))
            localStorage.setItem('auth_date', new Date())
            break

        case LEFT_MENU_STATE :
            localStorage.setItem('leftMenuState', action.payload.leftMenuState)
            break
    }

    return next(action)
}