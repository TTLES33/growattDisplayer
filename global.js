function addlog(type, message){
    dateNow = new Date();

    let hours = dateNow.getHours();
    let minutes = dateNow.getMinutes();
    let seconds = dateNow.getSeconds();

    if(hours < 10) hours = "0" + hours;
    if(minutes < 10) minutes = "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;


    let consoleMessage = "[" + hours + ":" + minutes + ":" + seconds + "]";
    consoleMessage += "[" + type + "]" ;
    consoleMessage +=  message;
    console.log(consoleMessage);
}

module.exports = {addlog};