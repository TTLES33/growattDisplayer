var express = require('express');
var app = express();
const path = require('path');


const sqlite3 = require("sqlite3");
const cors = require('cors');

const global = require("./global.js");
const growatt_controller = require("./growatt_controller.js");
const dbController = require("./dbController.js");
const file_controller = require("./file_controller.js");


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    global.addlog("INFO", `Example app listening at http://${host}:${port}`);
})


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));



app.get('/plantdata', async function (req, res) {
    global.addlog("GET", "/plantdata");
    res.send(growatt_controller.getGrowattCacheData());
    res.end();
})

app.get('/config', async function (req, res) {
    global.addlog("GET", "/config");
    try{
        const configData = await file_controller.configRead();
        res.status(200);
        res.json(configData)
        // res.setHeader('Content-Type', 'application/json');
    }catch(err){
        global.addlog("ERROR", "/config - " + err);
        res.sendStatus(500);
    }
})


app.post('/config/set/theme', async (req, res) => {
    const reqBody = req.body; 
    global.addlog("POST", JSON.stringify(reqBody));

    if (!reqBody || !reqBody.from || !reqBody.to) {
        return res.status(400).json({ message: 'from and to are required' });
    }

    try{
        await file_controller.configSetTheme(reqBody.from, reqBody.to);
    }catch(err){
        global.addlog("ERROR", "/config/set/theme - " + err);
        res.sendStatus(500);
    }

    res.status(201).json({
        message: 'updated successfully!'
    });
});
app.get('/', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/index.html'));
});
app.get('/index.html', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/index.html'));
});
app.get('/data.html', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/data.html'));
});
app.get('/htmljs.js', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/htmljs.js'));
});
app.get('/settingsjs.js', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/settingsjs.js'));
});
app.get('/temps.js', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/temps.js'));
});
app.get('/data.html', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/data.html'));
});
app.get('/css.css', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/css.css'));
});
app.get('/temps.css', function(req, res) {
    var dateNow = new Date();
    console.log("[" + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "][GET] " + req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/temps.css'));
});

app.get('/iframe/:tagid', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/iframe/' + req.params.tagid));
});


app.get('/media/dark/:tagid', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/media/dark/' + req.params.tagid));
});
app.get('/media/white/:tagid', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/media/white/' + req.params.tagid));
});
app.get('/media/:tagid', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.sendFile(path.join(__dirname, '/growattDisplayerClient/media/' + req.params.tagid));
});

app.get('/database/download', function(req, res) {
    global.addlog("GET", req.params.tagid);
    res.download(path.join(__dirname, '/data/tempDB.db'));
});





//********************************************** */
//          TEPLOTY
//********************************************** */

app.post('/temp/setData', function(req, res) {
 const reqBody = req.body; // Access the data sent in the request body
    global.addlog("POST", "/temp/setData " + JSON.stringify(reqBody))

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



app.post('/temp/getData', function(req, res) {
 const reqBody = req.body; // Access the data sent in the request body
    global.addlog("GET", "/temp/getData " + JSON.stringify(reqBody));

    dbController.selectTeplotaData(sqlite3, reqBody.from, reqBody.to, reqBody.sensorId).then(
        result => {
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
            res.end();
        }
        ).catch(err => {
            global.addlog("ERROR", "/temp/getData - " + err);
            res.sendStatus(501);
        });
   
});


app.get('/temp/getSensors', async function (req, res) {
        global.addlog("GET", "/temp/getSensors");

        dbController.selectSensors(sqlite3).then(
        result => {
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
            res.end();
        }
        ).catch(err => {
            global.addlog("ERROR", "/temp/getSensors - " + err);
            res.sendStatus(501);
        });
     
  
})




app.get('/temp/removeDB', function(req, res) {
    global.addlog("GET", "/bazen/removeDB" + req.params.tagid);
  
    dbController.removeDB(sqlite3);
      res.status(201).json({
        message: 'deleted successfully!'
    });
});


app.post('/temp/setSensorName', function(req, res) {
 const reqBody = req.body; // Access the data sent in the request body
    global.addlog("GET", "/temp/setSensorName " + JSON.stringify(reqBody));


    if (!reqBody || !reqBody.sensorId || !reqBody.name) {
        return res.status(400).json({ message: 'sensorId and name are required' });
    }

    try{
        file_controller.configSetSensorName(reqBody.sensorId, reqBody.name);
    }catch(err){
        global.addlog("ERROR", "/temp/setSensorName - " + err);
        res.sendStatus(501);
    }

    res.status(201).json({
        message: 'updated successfully!'
    });

});


