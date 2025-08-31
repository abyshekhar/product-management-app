import axios from "axios";

const API_URL = "http://localhost:5163/api"; // Backend URL

const api = axios.create({
  baseURL: API_URL,
});

export default api;
