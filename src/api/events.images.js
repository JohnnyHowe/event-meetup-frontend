import axios from "axios";
import { makeRequest } from "./helper.js";
import { getURL as rawGetURL } from "./helper.js";

async function get(id) {
    return makeRequest(axios.get, `events/${id}/image`);
}

function getURL(id) {
    return rawGetURL(`events/${id}/image`)
}

export default { get, getURL };
// export default { get };