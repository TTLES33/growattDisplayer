const api = require('growatt')
var express = require('express');
var app = express();

const user="FVE Grygar"
const passwort="Grygar2022"
const options={weather : false}
const cors = require('cors');

app.use(cors());
app.get('/plantdata', async function (req, res) {
   
    

      const growatt = new api({})
      let login = await growatt.login(user,passwort).catch(e => {console.log(e)})
      console.log('login:',login)
      let getAllPlantData = await growatt.getAllPlantData(options).catch(e => {console.log(e)})
      console.log('getAllPlatData:',JSON.stringify(getAllPlantData,null,' '));
      let logout = await growatt.logout().catch(e => {console.log(e)})
      console.log('logout:',logout);
    
      var simpleoutput = {
       
  "Battery_Discharged_Total": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.edischarge1Total,
  "Battery_Discharged_Today":  getAllPlantData["1531648"].devices.KHH0B1500P.totalData.edischarge1Today,
  "Battery_Charge_Now_Power": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.chargePower,
  "Battery_Discharge_Now_Power":  getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pdisCharge1,
  "Battery_Percentage": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.SOC,

  "Export_To_Grid_Now": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pactogrid,
  "Export_To_Grid_Today": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.etoGridToday,
  "Export_To_Grid_Total": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.etogridTotal,

  "Import_From_Grid_Now": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pactouser,
  "Import_From_Grid_Today": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.gridPowerToday,
  "Import_From_Grid_Total": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.gridPowerTotal,

  "Plant_Production_Now" : getAllPlantData["1531648"].devices.KHH0B1500P.statusData.ppv,
  "Plant_Production_Today": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.epvToday,
  "Plant_Production_Total": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.gridPowerTotal,

  "Total_energy_created": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.epvTotal,

  "Power_Consumption_Now": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pLocalLoad,
  "Power_Consumption_Today": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.elocalLoadToday, //(Load Consumption)
  "Self_Power_Consumption_Today": getAllPlantData["1531648"].devices.KHH0B1500P.totalData.eselfToday,

 

  "Battery_Voltage": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.vBat,
  "Grid_Voltage": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.vac1,
  "Grid_Frequency": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.fAc,
  "First_MPPT_Voltage": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.vPv1,
  "First_MPPT_Power": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pPv1,
  "Second_MPPT_Voltage": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.vPv2,
  "Second_MPPT_Power": getAllPlantData["1531648"].devices.KHH0B1500P.statusData.pPv2,

  "Last_Data_Update":  getAllPlantData["1531648"].devices.KHH0B1500P.deviceData.lastUpdateTime,
      };
      console.log(simpleoutput);
      console.log("request");

      res.send(simpleoutput);
      res.end();
    
  
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

async function LoadData() {
}
LoadData()