

/**
 * Take the iso date string and get an object with a date and time string
 * Month starts at 1
 * date: dd/mm/yyyy
 * time: hh:mm
 * 
 * @param {String} dateString 
 * @returns {Object}
 */
function getSmallString(dateString) {
    const inputForm = getInputFormatString(dateString);
    const dateParts = inputForm.date.split("-");
    const date = dateParts.reverse().join("/");
    return { date, time: inputForm.time };
}

/**
 * Take the iso date string and get the formats used by the html date and time inputs
 * Month starts at 1
 * date: yyyy-mm-dd 
 * time: hh:mm
 * @param {String} dateString 
 * @returns {Object}
 */
function getInputFormatString(dateString) {
    const dateObj = new Date(dateString)
    const date = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`
    const time = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`
    return { date, time };
}

/**
 * Get date but pretty
 * exact format undecided
 * 
 * @param {String} dateString 
 * @returns {String} nice date string
 */
function getPretty(dateString) {
      const simple = getSmallString(dateString);
      return `${simple.time} (24h) on the ${simple.date}`;
}


export { getInputFormatString, getSmallString, getPretty }