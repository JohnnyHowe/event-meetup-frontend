import axios from "axios";
import { makeRequest } from "./helper.js";
import store from "@/store";

import images from "./users.images.js";

/**
 * Given a POJO form containing an email, firstName, lastName and password, tell server to make a user
 * form example: {
 *  "firstName": "Adam",
 *  "lastName": "Anderson",
 *  "email": "aaa11@uclive.ac.nz",
 *  "password": "letmein"
 * }
 */
async function register(form, loginWhenComplete = true) {
    const registerRes = await makeRequest(axios.post, `users/register`, {}, form);
    if (loginWhenComplete) {
        await login(form);
    }
    return registerRes;
}

/**
 * Log the user in
 * Does all the setting of tokens and jazz for us
 * 
 * @param {{email: String, password: String}} form 
 */
export async function login(form) {
    const res = await makeRequest(axios.post, "users/login", {}, form);
    if (res.status == 200) {
        const userRes = await get(res.data.userId);
        store.userStore.login(res.data.token, userRes.data);
    }
    return res;
}

/**
 * Get the info about user
 *  first name
 *  last name
 *  email (if logged in as this user)
 * @param {number} userId 
 */
async function get(userId) {
    return makeRequest(axios.get, `users/${userId}`);
}

export default { images, register, login, get };
