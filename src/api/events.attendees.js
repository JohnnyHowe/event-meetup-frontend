import axios from "axios";
import { makeRequest } from "./helper.js";

async function get(eventId) {
    return makeRequest(axios.get, `events/${eventId}/attendees`);
}

async function add(id) {
    return makeRequest(axios.post, `events/${id}/attendees`)
}

export default { get, add };