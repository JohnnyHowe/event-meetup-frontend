/**
 * Format from html imput component
 * yyyy-mm-dd
 * 
 * returns list of errors
 */
function checkDate(date) {
    let errors = [];
    if (date == null || date === "") {errors.push("Date must exist")}
    if (date.split("-")[0].length != 4) {errors.push("Year must be 4 digits")}
    return errors;
}

/**
 * Format from html imput component
 * hh:mm
 * 
 * returns list of errors
 */
function checkTime(time) {
    let errors = [];
    if (time == null || time === "") {
        errors.push("Time must exist")
    }
    return errors;
}

export {checkDate, checkTime}