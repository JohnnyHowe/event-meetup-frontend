import axios from "axios";
import { makeRequest, readImage } from "./helper.js";
import { getURL as rawGetURL } from "./helper.js";

async function get(id) {
    return makeRequest(axios.get, `events/${id}/image`);
}

/**
 * Send image
 * Takes image as the html thing, nothing fancy
 */
async function put(id, image) {
    const img = await readImage(image)
    return makeRequest(axios.put, `events/${id}/image`, {}, img, {"Content-Type": image.type});
}

function getURL(id) {
    return rawGetURL(`events/${id}/image`)
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


export default { get, getURL, getSafeURL, put }