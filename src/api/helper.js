const VERBOSE = true;

/**
 * Do a get, put, or whatever
 * If VERBOSE, spit out "Get [url]" to console
 * @param method axios method to call
 * @param endpoint the endpoint to get data from. e.g. "events/1"
 */
export async function makeRequest(method, endpoint, body) {
    const url = process.env.VUE_APP_BACKEND_URL + "/" + endpoint;
    if (VERBOSE) console.log("Talk to: " + url);
    const config = {
        // headers: {
        //     'X-Authorization': store.authToken,
        // }
    }
    return method(url, body, config);
}

// /**
//  * Return a string containing all the parameters for an http request
//  * e.g. "?this=that&foo=bar" where this and foo are attributes of parameters
//  * 
//  * @param {POJO} parameters to add to the string
//  * @param {boolean} addNulls add "x=null" to the string if the value if null
//  */
// function getParamterString(parameters, addNulls = false) {
//     let string = "?";
//     for (let key in parameters) {
//         if (parameters[key] != null || addNulls) {
//             string += `${key}=${parameters[key]}&`;
//             string += "&"
//         }
//     }
//     return string.substr(0, string.length - 2);
// }