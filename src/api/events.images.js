import axios from "axios";
import { makeRequest } from "./helper.js";
import { getURL as rawGetURL } from "./helper.js";

async function get(id) {
    return makeRequest(axios.get, `events/${id}/image`);
}

function getURL(id) {
    return rawGetURL(`events/${id}/image`)
}

async function getSafeURL(id) {
    console.log("GET")
    let res;
    try {
        res = await get(id);
        res = getURL(id);
    } catch {
        res = null;
    }
    return res;
}


export default { get, getURL, getSafeURL }