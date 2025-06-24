import {createStore} from 'redux';
import {createWrapper} from 'next-redux-wrapper';
import reducers from './reducers/reducers';
import {middleware} from './middleware/index';
import {loadState, saveState} from './utils/localStorage';

const makeStore = () => {
    let preloadedState;

    if (typeof window !== 'undefined') {
        // Только на клиенте
        preloadedState = loadState();
    }

    const store = createStore(
        reducers,
        preloadedState,
        middleware
    );

    // Подписка на изменения — сохраняем нужные данные в localStorage
    if (typeof window !== 'undefined') {
        store.subscribe(() => {
            const state = store.getState();
            saveState({
                user: state.user,
                // article: state.articles
            });
        });
    }

    return store;
};

export const wrapper = createWrapper(makeStore, {debug: true});