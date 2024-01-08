import axios from 'axios'
import Store from '@/store'
import RequestErrors from '@/service/requestError'

const Service = {
    baseUrl: function () {
        const apiPort = process.env.NODE_ENV === 'development' ? '4106' : '443';
        return location.protocol + '//' + location.hostname + ':' + apiPort + '/api';
    },
    api: function (isForGraphElement) {
        // const loginPages = [
        //     '/',
        //     '/login'
        // ];
        const axiosInstance = axios.create({
            baseURL: Service.baseUrl(isForGraphElement),
            responseType: 'json',
            headers: {
                Authorization: 'Bearer ' + Store.state.token
            }
        });
        axiosInstance.interceptors.response.use(null, async function (error) {
            // if (error.response && error.response.status === 401) {
            //     Store.dispatch('setToken', null)
            //     Store.dispatch('setUser', null)
            //     if (loginPages.indexOf(window.location.pathname) === -1) {
            //         window.location.href = '/'
            //     }
            //     if (loginPages.indexOf(window.location.pathname) === -1) {
            //         window.location.href = '/'
            //     }
            // }
            if (!error.response || [403, 401].indexOf(error.response.status) === -1) {
                RequestErrors.addRequestError(error)
            }
            if (error.response && error.response.status === 502) {
                Store.dispatch("setIsServerNotResponding", true);
            }
            return Promise.reject(error)
        });
        return axiosInstance
    }
};
export default Service
