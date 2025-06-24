import * as types from "../actions/actionTypes"
import {HYDRATE} from 'next-redux-wrapper';

const initialState = {
    article: []
};

const articlesReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ARTICLE_FETCHED:
            console.log('articles fetched', action.article);
            return {
                ...state,
                article: action.article,
            };
        case HYDRATE:
            return {
                ...state,
                article: action.payload.article
            };
        default:
            return state;
    }
};

export default articlesReducer;
