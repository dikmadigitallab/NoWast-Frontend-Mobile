import axios from "axios";

const api = axios.create({
    baseURL: "http://nowastev2.api.dikmadigital.com.br/",
    withCredentials: true,
});

export default api;

