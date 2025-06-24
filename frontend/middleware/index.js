import {applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import { stateToLocalStorage } from './stateToLocalStorage';
import { removeLocalStorage } from './removeLocalStorage';
import { stateToCookie } from "./stateToCookie";

export const middleware = compose(
    applyMiddleware(thunk)
);
