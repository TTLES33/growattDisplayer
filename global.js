function addlog(type, message){
    dateNow = new Date();
    let consoleMessage = "[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "]";
    consoleMessage += "[" + type + "]" ;
    consoleMessage +=  message;
    console.log(consoleMessage);
}

module.exports = {addlog};