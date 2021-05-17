import axios from "axios";
import { makeRequest } from "./helper.js";

export async function get() {
    return makeRequest(axios.get, "events")
}