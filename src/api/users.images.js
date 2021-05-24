import axios from "axios";
import { makeRequest } from "./helper.js";
import { getURL as rawGetURL } from "./helper.js";

async function get(id) {
    return makeRequest(axios.get, `users/${id}/image`);
}

function getURL(id) {
    return rawGetURL(`users/${id}/image`)
}

async function getSafeURL(id) {
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