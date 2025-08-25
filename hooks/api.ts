import axios from "axios";

const api = axios.create({
    baseURL: "https://nowastev2.api.dikmadigital.com.br"
});

export default api;

