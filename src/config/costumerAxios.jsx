import axios from 'axios'

const costumerAxios = axios.create({
    baseURL : `${import.meta.env.VITE_BACKEND_URL}/`
})

export default costumerAxios;