const api = require('growatt')
const global = require("./global.js");
let loginData;
const options={
    weather : false,
    faultlog: true,
}
const errorOptions = {
    plantId: 1531648,   
}
let growattCacheData = {
        "loggerInfo":{
            deviceType: "",
            ipAddress: "",
            interval: "",
            lastUpdateTime: ""
        },

        "Battery_Discharged_Total": -1,
        "Battery_Discharged_Today":  -1,
        "Battery_Charge_Now_Power": -1,
        "Battery_Discharge_Now_Power":   -1,
        "Battery_Percentage":  -1,

        "Export_To_Grid_Now":  -1,
        "Export_To_Grid_Today":  -1,
        "Export_To_Grid_Total":  -1,

        "Import_From_Grid_Now":  -1,
        "Import_From_Grid_Today":  -1,
        "Import_From_Grid_Total":  -1,

        "Plant_Production_Now" :  -1,
        "Plant_Production_Today":  -1,
        "Plant_Production_Total":  -1,

        "Total_energy_created":  -1,

        "Power_Consumption_Now":  -1,
        "Power_Consumption_Today":  -1, //(Load Consumption)
        "Self_Power_Consumption_Today":  -1,

        

        "Battery_Voltage":  -1,
        "Grid_Voltage":  -1,
        "Grid_Frequency":  -1,
        "First_MPPT_Voltage":  -1,
        "First_MPPT_Power":  -1,
        "Second_MPPT_Voltage":  -1,
        "Second_MPPT_Power":  -1,

        "Last_Data_Update":  new Date().toString(),
        "Last_Server_Update": new Date().toString()

};


const growatt = new api({
    "server": process.env.GROWATT_SERVER	
})

async function login() {

    loginData = await growatt.login(process.env.GROWATT_USER,process.env.GROWATT_PASS).catch(e => {console.log(e)});
    global.addlog("INFO", "login succesfull");
}
const fs = require('node:fs').promises;
async function grawattDataUpdate(){

    global.addlog("INFO", "growattDataUpdate()");
    if(!loginData){
        global.addlog("ERROR", "504 /plantdata - No Login");
        await login();
    }

    dateNow = new Date();
    let loggers = await growatt.getDataLoggers().catch(e => {console.log(e)})
    let getAllPlantData = await growatt.getAllPlantData(options).catch(e => {})
 
    growattCacheData.Battery_Discharged_Total = getAllPlantData["1531648"].devices.KHH0B1500P.totalData.edischarge1Total,
    growattCacheData.Battery_Discharged_Today =   getAllPlantData["1531648"].devices.KHH0B1500P.totalData.edischarge1Today,
    growattCacheData.Battery_Charge_Now_Power =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.chargePower,
    growattCacheData.Battery_Discharge_Now_Power =   getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pdisCharge1,
    growattCacheData.Battery_Percentage =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.SOC,

    growattCacheData.Export_To_Grid_Now =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pactogrid,
    growattCacheData.Export_To_Grid_Today =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.etoGridToday,
    growattCacheData.Export_To_Grid_Total =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.etogridTotal,

    growattCacheData.Import_From_Grid_Now =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pactouser,
    growattCacheData.Import_From_Grid_Today =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.gridPowerToday,
    growattCacheData.Import_From_Grid_Total =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.gridPowerTotal,

    growattCacheData.Plant_Production_Now =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.ppv,
    growattCacheData.Plant_Production_Today =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.epvToday,
    growattCacheData.Plant_Production_Total =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.gridPowerTotal,

    growattCacheData.Total_energy_created =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.epvTotal,

    growattCacheData.Power_Consumption_Now =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pLocalLoad,
    growattCacheData.Power_Consumption_Today =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.elocalLoadToday, //(Load Consumption)
    growattCacheData.Self_Power_Consumption_Today =  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.eselfToday,

    

    growattCacheData.Battery_Voltage =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.vBat,
    growattCacheData.Grid_Voltage =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.vac1,
    growattCacheData.Grid_Frequency =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.fAc,
    growattCacheData.First_MPPT_Voltage =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.vPv1,
    growattCacheData.First_MPPT_Power =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pPv1,
    growattCacheData.Second_MPPT_Voltage =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.vPv2,
    growattCacheData.Second_MPPT_Power =  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pPv2,

    
    growattCacheData.loggerInfo.deviceType = loggers[0].deviceType;
    growattCacheData.loggerInfo.ipAddress = loggers[0].ipAndPort;
    growattCacheData.loggerInfo.interval = loggers[0].interval;
    growattCacheData.loggerInfo.lastUpdateTime = +new Date(loggers[0].lastUpdateTime);

    growattCacheData.Last_Data_Update =  +new Date(getAllPlantData["1531648"].devices.KHH0B1500P.deviceData.lastUpdateTime),
    growattCacheData.Last_Server_Update = Date.now();

}

async function startLoadDataRunner(interval){
    grawattDataUpdate();
    setInterval(grawattDataUpdate, interval);
}

function getGrowattCacheData(){
    return growattCacheData;
}

module.exports = {startLoadDataRunner, login, getGrowattCacheData};