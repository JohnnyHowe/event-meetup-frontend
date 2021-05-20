import axios from "axios";
import { makeRequest } from "./helper.js";

import images from "./events.images.js";

async function get() {
    return makeRequest(axios.get, "events")
}

async function categories() {
    return makeRequest(axios.get, "events/categories")
}

export default { images, get, categories };