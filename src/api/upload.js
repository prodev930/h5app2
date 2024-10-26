import { showToast } from "vant"

export const _fetchWithTimeout = (url, options, timeout = 60000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            showToast('上传超时')
            reject(new Error('Request timed out'));
        }, timeout);

        fetch(url, options)
            .then(response => {
                clearTimeout(timer);
                resolve(response);
            })
            .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
    });
}