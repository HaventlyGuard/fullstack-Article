export const isProd = process.env.NODE_ENV === 'production';

const url = process.env.SITE === 'players' ? 'http://localhost:3000' : 'http://localhost:3000';

const root = isProd ? url : 'http://localhost:3000';

const apiPath = `http://localhost:5190/api`;

export const addParams = (url, params = {}) => {
    if (params) {
        let query = Object.keys(params)
            .filter(param => params[param] !== undefined && params[param] != "")
            .map(param => {
                if (Array.isArray(params[param])) {
                    return params[param].map(item => encodeURIComponent(param) + '[]=' + item).join('&')
                }
                // return encodeURIComponent(param) + '=' + encodeURIComponent(params[param])
                if (param) {
                    return `${encodeURIComponent(param)}=${encodeURI(params[param])}`
                }
            })
            .join('&');
        url += query;
    }
    return url;
}

export const route = {
    profile: {
        user: (id) => `${apiPath}/user/${id}`,
        blocked: (id) => `${apiPath}/user/changeRole/${id}`,
        auth: `${apiPath}/user/`,
        reviewer: (id) => `${apiPath}/reviewer/${id}`,
        login: `${apiPath}/login`,
        refresh: `${apiPath}/auth/refresh/`,
        register: `${apiPath}/auth/register/`,
        authSocial: `${apiPath}/auth/social/`,
        rules: `${apiPath}/user/rules/`,
        roles: (id) => `${apiPath}/user/${id}/roles/`,
        spheres: `${apiPath}/spheres/`,
        areas: `${apiPath}/areas/`,
        forgotPassword: `${apiPath}/auth/forgot-password/`,
        resetPassword: `${apiPath}/auth/reset-password/`,
        subscribes: `${apiPath}/user/subscribed/`,
        update: () => `${apiPath}/user/`,
    },
    review : {
        create: `${apiPath}/review/`,
        item: (id) => `${apiPath}/review/${id}`,
        list: `${apiPath}/review?filter=0`,
        update: (id) => `${apiPath}/review/${id}`,
        progress: `${apiPath}/review/?filter=1`,
    },
    articles: {
        file: (id) => `${apiPath}/file/${id}`,
        create: `${apiPath}/article/`,
        item: (id) => `${apiPath}/article/${id}`,
        listAll: `${apiPath}/article`,
        list: `${apiPath}/article/ByAuthor?filter=0`,
        // submit: (id) => `${apiPath}/article/submit/${id}`,
        // review: (id) => `${apiPath}/article/review/${id}`,
        submit: `${apiPath}/article/ByAuthor?filter=1`,
        review: `${apiPath}/article/ByAuthor?filter=2`,
        delete: (id) => `${apiPath}/article/${id}/`,
    }
}