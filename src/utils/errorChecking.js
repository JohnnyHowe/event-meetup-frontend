/**
 * Format from html imput component
 * yyyy-mm-dd
 * 
 * returns list of errors
 */
function checkDate(date) {
    let errors = [];
    if (date == null || date === "") {errors.push("Date must exist")}
    let year = date.split("-")[0];
    if (year.length != 4) {errors.push("Year must be 4 digits")}
    if (year) {
        if (parseInt(year) > 2500) {
            errors.push("Date too far in future (past 2500)")
        }
    }
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