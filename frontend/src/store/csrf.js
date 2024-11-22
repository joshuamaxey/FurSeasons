import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
    options.method = options.method || 'GET'; // set options.method to GET if there is no method
    options.headers = options.headers || {}; // set options.headers to an empty object if there are no headers

    // if the options.method is not GET, set the "Content-Type" header (of the request?) to "application/json," and set the "XSRF-TOKEN" header to the value of the "XSRF-TOKEN" cookie
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    const res = await window.fetch(url, options); // call the default window's fetch with the url and the options passed in

    if (res.status >= 400) throw res; // if the response status code is 400 or above, then throw an error (with the response as the error)

    return res; // Otherwise, if the response status code is lower than 400, return the response to the next promise chain
}

export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}
