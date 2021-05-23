import axios from "axios";
import { makeRequest } from "./helper.js";

async function get(eventId) {
    return makeRequest(axios.get, `events/${eventId}/attendees`);
}

// async function getOne(eventId, attendeeId) {
//     return makeRequest(axios.get, `events/${eventId}/attendees/${attendeeId}`);
// }

export default { get };