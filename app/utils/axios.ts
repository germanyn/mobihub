import axios from "axios"
import { stringify } from 'qs';

export const axiosInstace = axios.create({
    paramsSerializer: params => stringify(params, {arrayFormat: 'repeat'})
})