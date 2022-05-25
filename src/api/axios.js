// Librarys
import axios from "axios";

// API
import { SECRET_PASSWORD } from "./credentials";

// Headers por defecto de Axios
axios.defaults.headers.post["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["SECRET_PASSWORD"] = SECRET_PASSWORD;

export default axios
