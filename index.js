

const api = require('growatt')
var express = require('express');
var app = express();
const path = require('path');
const fs = require('node:fs');
const dbController = require("./dbController.js");
const sqlite3 = require("sqlite3");


const user="FVE Grygar"
const passwort="Serikova40"
const options={weather : false}
const cors = require('cors');
const growatt = new api({
    "server": 'https://server.growatt.com/' 	
})
let login;
//let 


dateNow = new Date();
console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][INFO] login " + login);
console.log("Version: 1.2")

async function growattLogin() {
    login = await growatt.login(user,passwort).catch(e => {console.log(e)})
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.get('/plantdata', async function (req, res) {
    let dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] /plantdata");

    if(!login){
            console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][ERROR] 504 /plantdata - No Login");
        growattLogin();
          res.status(504).json({
            message: 'login error'
        });
        return 0;
        
    }
    




  
      let getAllPlantData = await growatt.getAllPlantData(options).catch(e => {console.log(e)})
    //  console.log('getAllPlatData:',JSON.stringify(getAllPlantData,null,' '));
      //let logout = await growatt.logout().catch(e => {console.log(e)})
    //dateNow = new Date();
    //console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][INFO] logout " + logout);
     
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
 
  "Last_Server_Update": dateNow.toString()
      };

      res.send(simpleoutput);
      res.end();
    
  
})
app.get('/config', async function (req, res) {
   
        fs.readFile('config.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
            res.end();
        }); 
  
})
app.post('/config/set/theme', (req, res) => {
    const reqBody = req.body; // Access the data sent in the request body
     var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][POST] " + reqBody);
    // Basic validation (in a real app, this would be more robust)
    if (!reqBody || !reqBody.from || !reqBody.to) {
        return res.status(400).json({ message: 'from and to are required' });
    }

    const fileName = 'config.json';

    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let file = JSON.parse(data);
        file.theme.from = reqBody.from;
        file.theme.to = reqBody.to;

        fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(file, null, 2));
            console.log('writing to ' + fileName);
        });

        res.status(201).json({
            message: 'updated successfully!'
        });

    });
   
        
  
});
app.get('/', function(req, res) {
    var dateNow = new Date();
   console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/index.html'));
});
app.get('/index.html', function(req, res) {
    var dateNow = new Date();
   console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid)
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/index.html'));
});
app.get('/data.html', function(req, res) {
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/data.html'));
});
app.get('/htmljs.js', function(req, res) {
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/htmljs.js'));
});
app.get('/data.html', function(req, res) {
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/data.html'));
});
app.get('/css.css', function(req, res) {
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/css.css'));
});
app.get('/media/dark/:tagid', function(req, res) {
    var dateNow = new Date();
   console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid)
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/media/dark/' + req.params.tagid));
});
app.get('/media/white/:tagid', function(req, res) {
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/media/white/' + req.params.tagid));
});
app.get('/media/:tagid', function(req, res) {
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/media/' + req.params.tagid));
});


app.post('/bazen/setData', function(req, res) {
 const reqBody = req.body; // Access the data sent in the request body
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][POST] /bazen/setData " + JSON.stringify(reqBody));


    if(reqBody == []){
        res.sendStatus(201);
        res.end();
    }

    for(i = 0; i < reqBody.length; i++){
    dbController.insertTeplotaRow(sqlite3, reqBody[i].teplota, reqBody[i].sensorId);
    }

    res.status(201).json({
        message: 'inserted successfully!'
    });
});



app.post('/bazen/getData', function(req, res) {
 const reqBody = req.body; // Access the data sent in the request body
    var dateNow = new Date();
    console.log(reqBody)
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] /bazen/getData " + JSON.stringify(reqBody));



    dbController.selectTeplotaData(sqlite3, reqBody.from, reqBody.to, reqBody.sensorId).then(
        result => {
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
            res.end();
        }
        ).catch(err => {
            console.log(err);
            res.sendStatus(501);
        });
   
});

app.get('/bazen/removeDB', function(req, res) {
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] /bazen/removeDB" + req.params.tagid);
    dbController.removeDB(sqlite3);
      res.status(201).json({
        message: 'deleted successfully!'
    });
});













var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    growattLogin();
    console.log("[INFO] Example app listening at http://%s:%s", host, port);
})




//dbController.selectTeplotaData(sqlite3, 1751725000000, 1751727000000)
