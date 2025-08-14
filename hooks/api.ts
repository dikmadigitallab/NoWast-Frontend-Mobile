import axios from "axios";

const api = axios.create({
    baseURL: "http://189.50.3.3:3308",
    withCredentials: true,
});

export default api;

