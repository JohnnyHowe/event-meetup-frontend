
import store from "@/store";
const VERBOSE = true;

/**
 * Do a get, put, or whatever
 * If VERBOSE, spit out "Get [url]" to console
 * @param method axios method to call
 * @param endpoint the endpoint to get data from. e.g. "events/1"
 */
export async function makeRequest(method, endpoint, parameters, body, headers) {
    const url = getURL(endpoint, parameters);
    if (VERBOSE) console.log("Talk to: " + url);
    let config = {
        headers: {
            'X-Authorization': store.userStore.authToken,
        }
    }
    config.headers = Object.assign(config.headers, headers);
    return method(url, body, config);
}

export function getURL(endpoint, parameters) {
    return process.env.VUE_APP_BACKEND_URL + "/" + endpoint + getParamterString(parameters);
}

/**
 * Return a string containing all the parameters for an http request
 * e.g. "?this=that&foo=bar" where this and foo are attributes of parameters
 * 
 * @param {POJO} parameters to add to the string
 * @param {boolean} addNulls add "x=null" to the string if the value if null
 */
function getParamterString(parameters, addNulls = false) {
    let string = "?";
    for (let key in parameters) {
        let obj = parameters[key];
        if (obj != null || addNulls) {

            if (Array.isArray(obj)) {
                for (let i of obj) {
                    string += `${key}=${i}&`;
                }
            } else {
                string += `${key}=${obj}&`;
            }
            string += "&"
        }
    }
    return string.substr(0, string.length - 2);
}

export async function readImage(imageBlob) {
    return blobToData(imageBlob);
}

const blobToData = (blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsArrayBuffer(blob)
    })
}