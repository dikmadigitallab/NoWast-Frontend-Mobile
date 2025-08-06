import { PUBLIC_API_URL } from "@env";
import axios from "axios";

const api = axios.create({
    baseURL: PUBLIC_API_URL,
});

export default api;

