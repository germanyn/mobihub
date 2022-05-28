import axios from "axios"
import qs from 'qs';

export const axiosInstace = axios.create({
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
})