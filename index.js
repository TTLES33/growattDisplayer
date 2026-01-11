const { loadEnvFile } = require('node:process');
loadEnvFile('setup.env');


const global = require("./global.js");
const db_controller = require("./dbController.js");
const api_controller = require("./api_controller.js");

async function startServer() {
    global.addlog("INFO", `Version: ${process.env.APP_VERSION}`);

    await db_controller.updateDBStructure();
}







startServer();