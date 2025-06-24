import {getCookie} from "./public/cookie";

export function getTranslation(req = '') {
    return getCookie('lang', req) ?? 'ru'
}