const { loadEnvFile } = require('node:process');
loadEnvFile('setup.env');



const global = require("./global.js");
const api_controller = require("./api_controller.js");
const growatt_controller = require("./growatt_controller.js");





//TODO: implement let res = await growatt.setDataLoggerRestart(loggers[0].sn).catch(e => {console.log(e)})



global.addlog("INFO", `Version: ${process.env.APP_VERSION}`);

growatt_controller.growattLogin();

//Refresh plant data periodically
growatt_controller.grawattDataUpdate();
setInterval(growatt_controller.grawattDataUpdate, 110000);

