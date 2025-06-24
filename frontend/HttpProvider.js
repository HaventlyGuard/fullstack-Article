import Error from "next/error";

const fetch = require('node-fetch');

const getTokenAccess = () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : false
    return token && token !== 'undefined' ? JSON.parse(localStorage.getItem('token')).access : '';
}

class HttpProvider {

    static get(url,  method = 'GET') {
        return fetch(`${url}`, {
            credentials: 'include',
            method
        }
        ).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        })
    }

    static _send(url, method = 'POST', data = {}, headers = {}) {
        return fetch(`${url}`, {
            method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify(data)
        }).then((response) => {

            if (!response.ok && response.detail == "undefined") {
                const error = new Error(response.statusText);
                console.error(error);
            }

            if (method !== 'DELETE') {
                return response.json();
            }
        })
    }

    static sendFormData(url, data) {
        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {

            if (!response.ok) {
                const error = new Error(response.statusText);
                console.error(error);
            }

            return response.json();
        })
    }

    static post(url, data = {}) {
        return this._send(url, 'POST', data);
    }

    static put(url, data = {}) {
        return this._send(url, 'PUT', data);
    }

    static del(url, data = {}) {
        return this._send(url, 'DELETE', data, {'Authorization': getTokenAccess()});
    }

    static auth(url) {
        return this.get(url, {headers: {'Authorization': getTokenAccess()}});
    }

    static auth_post(url, data) {
        return this._send(url, 'POST', data, {'Authorization': getTokenAccess()});
    }

}

export {getTokenAccess};
export default HttpProvider;