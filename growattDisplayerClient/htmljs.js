var plantdata = {};
let Last_Temperature_Update = "never";
var activepage;
let theme = "dark";
let config = {};
let errorLogs = []; 


async function onloadfnc(){
    document.documentElement.dataset["theme"] = "dark";

    await loadConfig();
    updateTemperatures()
    checkForAutoThemeChange();

    showIndex();

    autoupdater();

}


let plantDataIntervel;
let tempInterval;
function autoupdater(){
    console.log("function: autoupdater()");
    loadData();
    updateTemperatures();

    plantDataIntervel = setInterval(function(){
        if(activepage = "index"){
            loadData();
        }
        checkForAutoThemeChange();
    }, 120000)

    tempInterval = setInterval(function(){
        updateTemperatures();
    }, 1000 * 10);
}



//******************************* */
//      THEMES (DARK / LIGHT)
//******************************* */
function toggleTheme(){

     if(theme == "light"){
        document.documentElement.dataset["theme"] = "dark";
        theme = "dark";
     }else{
        document.documentElement.dataset["theme"] = "light";
        theme = "light";
     }
}

function checkForAutoThemeChange(){
    console.log("Function: checkForAutoThemeChange");
    const now = new Date();
    const hours = now.getHours();


    const configDateFrom = new Date(config.from);
    const configDateTo = new Date(config.to);

    if(hours > configDateFrom.getHours() && hours < configDateTo.getHours()){
        //white theme
        if(theme != "light"){
            toggleTheme();
        }
    }else{
        //dark theme
        if(theme != "dark"){
            toggleTheme();
        }
    }


}



//******************************* */
//      RENDER DIFFERENT PAGES
//******************************* */
async function showIndex(){
    activepage = "index";
    console.log("function: showIndex()");

    await loadPage("index");
    updateTemperatures();
    loadData();
}

async function showData(){
    activepage = "data";
    console.log("function: dataPageCreator()");

    await loadPage("data");

    updateDataPage(plantdata, );
    // for(i=0; i< Object.keys(plantdata).length; i++){
    //     console.log(Object.keys(plantdata)[i]);
    //     console.log(plantdata[Object.keys(plantdata)[i]]);
    //     document.getElementById(Object.keys(plantdata)[i]).innerHTML = plantdata[Object.keys(plantdata)[i]];
    // }
    // document.getElementById("Last_Temperature_Update").innerHTML = new Date(Last_Temperature_Update ).toString();
}

async function showSettings(){
    activepage = "settings";
    await loadPage("settings");

    document.getElementById("settTimeFrom").valueAsNumber = config.from;
    document.getElementById("settTimeTo").valueAsNumber = config.to;

    let errLogs = document.getElementById("errorLogs");
    errLogs.innerHTML = "";
    for(i = 0; i < errorLogs.length; i++){
        errLogs.innerHTML = errLogs.innerHTML + errorLogs[i] + "<br>";
    }

    renderAvaibleSensors();
}

async function showTemps(params) {
    activepage = "temps";
    console.log("function: dataPageCreator()");

    await loadPage("temps");
    
    tempsPageFirstLoad();
    loadAllTemperatures();

    const tempsInterval = setInterval(function () {
        if(activepage != "temps"){
            clearInterval(tempsInterval);
        }
        loadAllTemperatures();
    }, 1000 * 30);

}

async function loadPage(page){
        return $.ajax({
        type: "GET",
        url: '/iframe/' + page + '.html',
        success: function (result) {
         
            console.log(plantdata);
            document.getElementById("pageIFrame").innerHTML = result;

        },
        error: function (xhr, ajaxOptions, thrownError) {
          showError(thrownError);
        }
      });
}


//********************************************** */
// Helper functions for rendering data on specific parts of grid:
function renderDataBattery(plantdata, error){
    if(error){
        document.getElementById("percentage").innerHTML = "error";
        document.getElementById("power").innerHTML = "data elektrárny starší než 10min";
        document.getElementById("battery_text").innerHTML = "";
        document.getElementById("percentage").style.color = "var(--arrow_red)";
        document.getElementById("battery-level").style.setProperty("height", 0) ; 

        for(i=0; i < document.getElementById("arrow_0").childNodes.length; i++ ){
            document.getElementById("arrow_0").childNodes[i].style.display = "none";
        }

        return;
    }
    document.getElementById("percentage").style.color = "var(--text-color)";


    var battery_height = "calc(" + plantdata.Battery_Percentage + "% - 4px)";
    console.log(battery_height)


    document.getElementById("percentage").innerHTML = plantdata.Battery_Percentage;
    document.getElementById("battery-level").style.setProperty("height", battery_height) ;
    if(plantdata.Battery_Percentage > 50){
        document.getElementById("battery-level").style.backgroundColor = "var(--arrow_green)";    
    }else{
        document.getElementById("battery-level").style.backgroundColor = "var(--arrow_red)";     
    }


    if(plantdata.Battery_Charge_Now_Power > 0){
        document.getElementById("battery_text").innerHTML = "nabíjení";
        document.getElementById("power").innerHTML = plantdata.Battery_Charge_Now_Power + "kW";
        for(i=0; i < document.getElementById("arrow_0").childNodes.length; i++ ){
            document.getElementById("arrow_0").childNodes[i].className = "arrow_top";
            document.getElementById("arrow_0").childNodes[i].classList.add("charging");
            document.getElementById("arrow_0").childNodes[i].style.borderBottomColor = "var(--arrow_green)";
            document.getElementById("arrow_0").childNodes[i].style.display = "block";
        }
    }else{
        if(plantdata.Battery_Discharge_Now_Power > 0){
            document.getElementById("battery_text").innerHTML = "vybíjení";
            document.getElementById("power").innerHTML = plantdata.Battery_Discharge_Now_Power + "kW";
            for(i=0; i < document.getElementById("arrow_0").childNodes.length; i++ ){
                console.log(document.getElementById("arrow_0"));
                document.getElementById("arrow_0").childNodes[i].className = "arrow_down";
                document.getElementById("arrow_0").childNodes[i].style.borderTopColor = "var(--arrow_red)";
                document.getElementById("arrow_0").childNodes[i].style.display = "block";
            }
        }else{
            document.getElementById("power").innerHTML = "0 kW";
            document.getElementById("battery_text").innerHTML = "";
            for(i=0; i < document.getElementById("arrow_0").childNodes.length; i++ ){
                console.log(i);
                document.getElementById("arrow_0").childNodes[i].style.display = "none";
            }
        }
    }
}

function renderDataHome(plantdata, error){
    if(error){
        document.getElementById("home_text").innerHTML =  "-- kW";
        for(i=0; i < document.getElementById("arrow_3").childNodes.length; i++ ){
            document.getElementById("arrow_3").childNodes[i].style.display = "none";
        }
        return;
    }

    for(i=0; i < document.getElementById("arrow_3").childNodes.length; i++ ){
        document.getElementById("arrow_3").childNodes[i].style.display = "block";
    }
    document.getElementById("home_text").innerHTML = plantdata.Power_Consumption_Now + "kW";
}

function renderDataPlant(plantdata, error){
    if(error){
        document.getElementById("foto_text").innerHTML = "-- kW";
        for(i=0; i < document.getElementById("arrow_1").childNodes.length; i++ ){
            document.getElementById("arrow_1").childNodes[i].style.display = "none";
        }
        return ;
    }

    document.getElementById("foto_text").innerHTML = plantdata.Plant_Production_Now;
    if(plantdata.Plant_Production_Now > 0){
        document.getElementById("foto_text").innerHTML = plantdata.Plant_Production_Now + "kW";
        for(i=0; i < document.getElementById("arrow_1").childNodes.length; i++ ){
            document.getElementById("arrow_1").childNodes[i].className = "arrow_right";
            document.getElementById("arrow_1").childNodes[i].style.borderLeftColor = "var(--arrow_green)";
            document.getElementById("arrow_1").childNodes[i].style.display = "block";
        }
    }else{
        document.getElementById("foto_text").innerHTML = "0 kW";
        for(i=0; i < document.getElementById("arrow_1").childNodes.length; i++ ){
            document.getElementById("arrow_1").childNodes[i].style.display = "none";
        }
    }
}

function renderDataGrid(plantdata, error){
    if(error){
        document.getElementById("grid_nadpis").innerHTML = "";
        document.getElementById("grid_text").innerHTML = "-- kW";

        for(i=0; i < document.getElementById("arrow_2").childNodes.length; i++ ){
            document.getElementById("arrow_2").childNodes[i].style.display = "none";
        }
        return ;
    }


    if(plantdata.ExportToGrid <= 0){
    document.getElementById("grid_nadpis").innerHTML = "Import";
    document.getElementById("grid_text").innerHTML = plantdata.Import_From_Grid_Now + " kW";
    for(i=0; i < document.getElementById("arrow_2").childNodes.length; i++ ){
        document.getElementById("arrow_2").childNodes[i].className =  "arrow_left";
        document.getElementById("arrow_2").childNodes[i].style.borderLeftColor = "var(--arrow_red)";
        document.getElementById("arrow_2").childNodes[i].style.display = "block";
    }
    }else{
        document.getElementById("grid_nadpis").innerHTML = "Export";
        document.getElementById("grid_text").innerHTML = plantdata.Export_To_Grid_Now + " kW";

        for(i=0; i < document.getElementById("arrow_2").childNodes.length; i++ ){
            document.getElementById("arrow_2").childNodes[i].className = "arrow_right";
            document.getElementById("arrow_2").childNodes[i].style.borderRightColor = "var(--arrow_green)";
            document.getElementById("arrow_2").childNodes[i].style.display = "block";
        }
    }
}

function loadData(){
    console.log("Function: loadData()");

    $.ajax({
        type: "GET",
        url: '/plantdata',
        success: function (result) {
            plantdata = result;
            plantdata.Last_Local_Update = Date.now();
            //check for old data
            const dateToCheck = new Date(plantdata.Last_Data_Update);
            const currentTimeMillis = Date.now();
            //if difference is bigger than 10 minutes
            if((currentTimeMillis - dateToCheck.getTime()) > (10 * 60 * 1000)){

                renderDataBattery(plantdata, true);
                renderDataHome(plantdata, true);
                renderDataPlant(plantdata, true);
                renderDataGrid(plantdata, true);

                return;
            }else{
                document.getElementById("percentage").style.color = "none";
            }

            //battery
            renderDataBattery(plantdata, false);

            //home
            renderDataHome(plantdata, false);

            //plant
            renderDataPlant(plantdata, false);

            //grid
            renderDataGrid(plantdata, false);

        },
        error: function (xhr, ajaxOptions, thrownError) {

            showError(thrownError);

            setTimeout(() => {
                loadData(); 

            }, "5000");
        }
      });
}








//******************************* */
//      TEMPERATURE SENSORS
//******************************* */
async function updateTemperatures(){
    //continue only on index page
    if(activepage != "index"){
        return;
    }
    //24 hours
    let dateNow = Date.now();
    let dateFrom = dateNow - 86400000;

    //console.log(dateNow);
    //console.log(dateFrom);

    let tempdata0 = await loadTemperature(dateFrom, dateNow, 45);
    let tempdata1 = await loadTemperature(dateFrom, dateNow, 129);

    let tempObject0 = tempdata0[tempdata0.length - 2];
    let tempObject1 = tempdata1[tempdata1.length - 2];

    let tempString0 = Number.parseFloat(tempObject0.avg_temp).toFixed(1) + "°C";
    let tempString1 = Number.parseFloat(tempObject1.avg_temp).toFixed(1) + "°C";


    //check for old data
    const dateToCheck0 = new Date(tempObject0.time_label);
    const dateToCheck1 = new Date(tempObject1.time_label);
    const currentTimeMillis = Date.now();
    //if difference is bigger than 1 minute
    if((currentTimeMillis - dateToCheck0.getTime()) > (2 * 60 * 1000) || tempObject0.avg_temp == null){
        document.getElementById("tempContainer0").classList.add("tempError")
        tempString0 = tempString0 + " ⚠";
    }else{
        document.getElementById("tempContainer0").classList.remove("tempError")
    }

    if((currentTimeMillis - dateToCheck1.getTime()) > (2 * 60 * 1000) || tempObject1.avg_temp == null){
        document.getElementById("tempContainer1").classList.add("tempError")
        tempString1 = tempString1 + " ⚠";
    }else{
        document.getElementById("tempContainer1").classList.remove("tempError")
    }


    //insert data to HTML elements
    document.getElementById("tempValue0").innerHTML = tempString0;
    document.getElementById("tempValue1").innerHTML = tempString1;

}



async function loadTemperature(from, to, sensorId){
      console.log("Function: loadTemperature");
  const url = "/temp/getData";

   try {
    const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                "from": from,
                "to": to,
                "sensorId": sensorId
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
    });
    if (!response.ok) {
      let response = `Response status: ${response.status}`;
        showError(response)
        throw new Error(response);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
    showError(error.message);
  }
}




//******************************* */
//      MISC FUNCTIONS
//******************************* */
function toggleFullScreen() {
    let element = document.documentElement;
  if (!document.fullscreenElement) {
    // If the document is not in full screen mode
    // make the video full screen
    element.requestFullscreen();
  } else {
    // Otherwise exit the full screen
    document.exitFullscreen?.();
  }
}

function showError(errMsg){
    errMsg = "error: " + errMsg;
    let errElement = document.getElementById("errorContainer");
    let errTextElement = document.getElementById("errorText");
    errorLogs.push(errMsg);


    errElement.style.display = "flex";
    errTextElement.innerHTML = errMsg;

    setTimeout(() => {
     errElement.style.display = "none";
    }, "5000");

}