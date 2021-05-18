import axios from "axios";
import { makeRequest } from "./helper.js";

import images from "./events.images.js";

async function get() {
    return makeRequest(axios.get, "events")
}

export default { images, get };