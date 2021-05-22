import axios from "axios";
import { makeRequest } from "./helper.js";

import images from "./events.images.js";

async function get(params) {
    return makeRequest(axios.get, "events", params);
}

async function categories() {
    return makeRequest(axios.get, "events/categories")
}

async function add(form) {
    return makeRequest(axios.post, "events", {}, form)
}

export default { images, get, categories, add };