import * as types from './actionTypes';
import { route } from '../route';
const fetch = require("node-fetch");

export function fetchArticle(id, token = '') {
    return async(dispatch) => {

        return fetch(route.articles.listAll)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('fetchArticle', result);
                    console.log('Dispatching type:', types.ARTICLE_FETCHED);
                    dispatch({type: types.ARTICLE_FETCHED, article: result});
                    // return result
                },
                (error) => {
                    console.error(error);
                }
            );
    }
}