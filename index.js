const { loadEnvFile } = require('node:process');
loadEnvFile('setup.env');


const global = require("./global.js");
const api_controller = require("./api_controller.js");
const growatt_controller = require("./growatt_controller.js");

async function startServer() {
    global.addlog("INFO", `Version: ${process.env.APP_VERSION}`);

    await growatt_controller.login();

    //Refresh plant data periodically
    growatt_controller.startLoadDataRunner(interval = 110000);
}



startServer();


//TODO: implement let res = await growatt.setDataLoggerRestart(loggers[0].sn).catch(e => {console.log(e)})



