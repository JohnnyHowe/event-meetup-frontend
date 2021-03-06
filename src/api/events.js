import axios from "axios";
import { makeRequest } from "./helper.js";

import images from "./events.images.js";
import attendees from "./events.attendees";

async function get(params) {
    return makeRequest(axios.get, "events", params);
}

async function getOne(id) {
    return makeRequest(axios.get, `events/${id}`);
}

async function categories() {
    return makeRequest(axios.get, "events/categories")
}

async function add(form) {
    return makeRequest(axios.post, "events", {}, form)
}

async function put(id, form) {
    return makeRequest(axios.patch, `events/${id}`, {}, form)
}

async function remove(id) {
    return makeRequest(axios.delete, `events/${id}`)
}

export default { images, attendees, get, put, categories, add, getOne, remove };