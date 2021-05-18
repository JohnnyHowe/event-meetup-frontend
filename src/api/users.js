import axios from "axios";
import { makeRequest } from "./helper.js";

/**
 * Given a POJO form containing an email, firstName, lastName and password, tell server to make a user
 * form example: {
 *  "firstName": "Adam",
 *  "lastName": "Anderson",
 *  "email": "aaa11@uclive.ac.nz",
 *  "password": "letmein"
 * }
 */
async function register(form) {
    const registerRes = await makeRequest(axios.post, `users/register`, {}, form);
    // if (loginWhenComplete) {
    //     login(form);
    // }
    return registerRes;
}

// /**
//  * Get the info about user
//  *  first name
//  *  last name
//  *  email (if logged in as this user)
//  * @param {number} userId 
//  */
// async function getUserData(userId) {
//     return makeRequest(axios.get, `users/${userId}`);
// }

export default {register};
