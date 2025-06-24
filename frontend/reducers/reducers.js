import { combineReducers } from 'redux';
import articlesReducer from './articles';
// import profile from './profile';
import user from './user';

const reducers = combineReducers({
    articles: articlesReducer,
    // profile,
    user,
});

export default reducers


