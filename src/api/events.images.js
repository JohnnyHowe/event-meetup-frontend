import axios from "axios";
import { makeRequest } from "./helper.js";

async function get(id) {
    return makeRequest(axios.get, `events/${id}/image`);
}

export default { get };