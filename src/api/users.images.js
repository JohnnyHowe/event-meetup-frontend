import axios from "axios";
import { makeRequest, readImage } from "./helper.js";
import { getURL as rawGetURL } from "./helper.js";


async function get(id) {
    return makeRequest(axios.get, `users/${id}/image`);
}

/**
 * Send image
 * Takes image as the html thing, nothing fancy
 */
async function put(id, image) {
    const img = await readImage(image)
    return makeRequest(axios.put, `users/${id}/image`, {}, img, {"Content-Type": image.type});
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

async function remove(id) {
    return makeRequest(axios.delete, `users/${id}/image`);
}


export default { get, put, getURL, getSafeURL, remove }