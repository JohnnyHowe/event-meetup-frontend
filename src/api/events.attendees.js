import axios from "axios";
import { makeRequest } from "./helper.js";

async function get(eventId) {
    return makeRequest(axios.get, `events/${eventId}/attendees`);
}

async function add(eventId) {
    return makeRequest(axios.post, `events/${eventId}/attendees`)
}

async function remove(eventId) {
    return makeRequest(axios.delete, `events/${eventId}/attendees`)
}

export default { get, add, remove };