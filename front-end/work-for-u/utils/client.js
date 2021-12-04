import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'


const RESPONSE_TIMEOUT = 20000

const client = axios.create({
    // baseURL: BASE_API_URL,
    timeout: RESPONSE_TIMEOUT
})

client.defaults.headers

client.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        if (window !== undefined) {
            const bhyveToken = localStorage.getItem('accessToken')
            config.headers['accessToken'] = bhyveToken
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

client.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const responseStatus = error.response?.status
        if (responseStatus === 401) {
            console.log('unauthorizes. logging out...')
            if (window) {
               window.location.assign("/logout");
            }
        }
        return Promise.reject(error)
    }
)

export default client
