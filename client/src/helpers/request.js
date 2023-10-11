import axios from "axios";
import { API_BASE } from "constants/domain";

// Create axios instance with prefixed base url
const request = axios.create({
    baseURL: API_BASE
});

export default request;