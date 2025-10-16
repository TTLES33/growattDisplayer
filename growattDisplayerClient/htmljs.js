var plantdata = {};
let Last_Temperature_Update = "never";
var activepage;
let theme = "dark";
let config = {};
let errorLogs = []; 
function screen(){
    //alert(window.innerWidth);
   // alert(window.innerHeight)
}

function loadData(){
    console.log("Function: loadData()");

    $.ajax({
        type: "GET",
        url: '/plantdata',
        success: function (result) {
            plantdata = result;
            localStorage.setItem("plantdata", JSON.stringify(plantdata));
            console.log(plantdata);
            if(activepage == "index"){
                mainPageCreator();
            }else if(activepage == "data"){
                dataPageCreator()
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
          //alert(xhr.status);
         // alert(thrownError);

          showError(thrownError);

           setTimeout(() => {
               loadData(); 

            }, "5000");

        }
      });
}



function mainPageCreator(){

    console.log("function: mainPageCreator()");

//battery
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

 //home
 document.getElementById("home_text").innerHTML = plantdata.Power_Consumption_Now + "kW";

 //plant
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

 //grid
 if(plantdata.ExportToGrid <= 0){
    document.getElementById("grid_nadpis").innerHTML = "Import";
    document.getElementById("grid_text").innerHTML = plantdata.Import_From_Grid_Now + " kW";
    for(i=0; i < document.getElementById("arrow_2").childNodes.length; i++ ){
        document.getElementById("arrow_2").childNodes[i].className =  "arrow_left";
        document.getElementById("arrow_2").childNodes[i].style.borderLeftColor = "var(--arrow_red)";
    }
 }else{
    document.getElementById("grid_nadpis").innerHTML = "Export";
    document.getElementById("grid_text").innerHTML = plantdata.Export_To_Grid_Now + " kW";

    for(i=0; i < document.getElementById("arrow_2").childNodes.length; i++ ){
        document.getElementById("arrow_2").childNodes[i].className = "arrow_right";
        document.getElementById("arrow_2").childNodes[i].style.borderRightColor = "var(--arrow_green)";
    }
 }



 document.getElementById("loadingDiv").style.display = "none";
 document.getElementById("container").style.display = "grid";
}

function dataPageCreator(){
    console.log("function: dataPageCreator()");
    for(i=0; i< Object.keys(plantdata).length; i++){
        console.log(Object.keys(plantdata)[i]);
        console.log(plantdata[Object.keys(plantdata)[i]]);
        document.getElementById(Object.keys(plantdata)[i]).innerHTML = plantdata[Object.keys(plantdata)[i]];
    }
    document.getElementById("Last_Temperature_Update").innerHTML = new Date(Last_Temperature_Update ).toString();
}
function autoupdater(){
    console.log("function: autoupdater()");
    setInterval(function(){
        loadData();
        checkForAutoThemeChange();
    }, 120000)
}

async function onloadfnc(){
    await loadConfig();
    updateTemperatures()
    checkForAutoThemeChange();
    if (localStorage.getItem("plantdata") !== null) {
        plantdata = JSON.parse(localStorage.getItem("plantdata"));
        var olddate = new Date(plantdata.Last_Data_Update);
        var nowdate = new Date();
        var minutesdiff = Math.floor(((nowdate - olddate)/1000)/60);
        console.log(minutesdiff);
            if(minutesdiff >= 5){
                loadData();
                autoupdater();
            }else{
                if(activepage == "index"){
                    mainPageCreator();
                }else if(activepage == "data"){
                    dataPageCreator()
                }
                autoupdater()
            }
        }else{
            loadData();
            autoupdater();
        }

}

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

function toggleTheme(){
    const homeIcon = document.getElementById("homeIcon");
    const dataIcon = document.getElementById("dataIcon");
    const themeIcon = document.getElementById("themeIcon");
    const settingsIcon = document.getElementById("settingsIcon");
    const inside_temp_icon = document.getElementById("inside_temp_icon")
    const outside_temp_icon = document.getElementById("outside_temp_icon")
    const homeElement = document.getElementById("homeElement");
    const solarElement = document.getElementById("solarElement");
    const gridElement = document.getElementById("gridElement");
    
    const root = document.documentElement;

    if(theme == "white"){
        homeIcon.src = "media/dark/home_icon_fill.svg";
        dataIcon.src = "media/dark/stats_icon.svg";
        themeIcon.src = "media/dark/theme_icon.svg";
        settingsIcon.src = "media/dark/settings_icon.svg";
        inside_temp_icon.src = "media/dark/home_icon.svg";
        outside_temp_icon.src = "media/dark/outside_icon.svg";
        homeElement.src = "media/dark/home_icon.svg";
        solarElement.src = "media/dark/solar_panel_icon.png";
        gridElement.src = "media/dark/power_plant.svg";

        root.style.setProperty('--nav_background', '#141218');
        root.style.setProperty('--nav_button_background', '#4a4458');
        root.style.setProperty('--background', '#0f0d13');
        root.style.setProperty('--text_color', '#e6e6e6');

        theme = "dark";
    }else{
        homeIcon.src = "media/white/home_icon_fill.svg";
        dataIcon.src = "media/white/stats_icon.svg";
        themeIcon.src = "media/white/theme_icon.svg";
        homeElement.src = "media/white/home_icon.svg";
        settingsIcon.src = "media/white/settings_icon.svg";
        inside_temp_icon.src = "media/white/home_icon.svg";
        outside_temp_icon.src = "media/white/outside_icon.svg";
        solarElement.src = "media/white/solar_panel_icon.png";
        gridElement.src = "media/white/power_plant.svg";

        root.style.setProperty('--nav_background', '#fef7ff');
        root.style.setProperty('--nav_button_background', '#e8def8');
        root.style.setProperty('--background', '#ffffff');
        root.style.setProperty('--text_color', 'black');

        theme = "white";
    }
}

function showIndex(){
    activepage = "index";
    document.getElementById("body").style.display = "flex";
    document.getElementById("bodyData").style.display = "none";
    document.getElementById("bodySettings").style.display = "none";
}


function showData(){
    activepage = "data";
    document.getElementById("body").style.display = "none";
    document.getElementById("bodyData").style.display = "flex";
    document.getElementById("bodySettings").style.display = "none";
    onloadfnc();
}

function showSettings(){
    activepage = "settings";
    document.getElementById("body").style.display = "none";
    document.getElementById("bodyData").style.display = "none";
    document.getElementById("bodySettings").style.display = "flex";

    document.getElementById("settTimeFrom").valueAsNumber = config.from;
    document.getElementById("settTimeTo").valueAsNumber = config.to;

    let errLogs = document.getElementById("errorLogs");
    errLogs.innerHTML = "";
    for(i = 0; i < errorLogs.length; i++){
        errLogs.innerHTML = errLogs.innerHTML + errorLogs[i] + "<br>";
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
        if(theme != "white"){
            toggleTheme();
        }
    }else{
        //dark theme
        if(theme != "dark"){
            toggleTheme();
        }
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

async function updateTemperatures(){
    //24 hours
    let dateNow = Date.now();
    let dateFrom = dateNow - 86400000;

    

    console.log(dateNow);
    console.log(dateFrom);

    let tempdata0 = await loadTemperature(dateFrom, dateNow, 45);
    let tempdata1 = await loadTemperature(dateFrom, dateNow, 129);

    

    document.getElementById("tempValue0").innerHTML = Number.parseFloat(tempdata0[0].teplota).toFixed(1) + "°C";
    document.getElementById("tempValue1").innerHTML = Number.parseFloat(tempdata1[0].teplota).toFixed(1) + "°C";
    Last_Temperature_Update = tempdata0[0].datetime;
    
    let tempArray0 = [];
    let chartLabels0 = [];

    let tempArray1 = [];
    let chartLabels1 = [];

    // let minTemp = Number.MAX_SAFE_INTEGER;
    // let maxTemp = Number.MIN_SAFE_INTEGER;


    // //tempdata0
    // for(i = tempdata0.length - 1; i >= 0; i--){
    //     let temp = tempdata0[i].teplota
    //     tempArray0.push(parseFloat(temp));
    //     if(temp < minTemp){
    //         minTemp = temp;
    //     }
    //     if(temp > maxTemp){
    //         maxTemp = temp;
    //     }


    //     var date = new Date(tempdata0[i].datetime);
    //     var hours = date.getHours();

    //     // Minutes part from the timestamp
    //     var minutes = "0" + date.getMinutes();

    //     // Seconds part from the timestamp
    //     var seconds = "0" + date.getSeconds();

    //     // Will display time in 10:30:23 format
    //     var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    //     chartLabels0.push(formattedTime);
    // }
    
    // //tempdata1
    // for(i = tempdata1.length - 1; i >= 0; i--){
    //     let temp = tempdata1[i].teplota
    //     tempArray1.push(parseFloat(temp));
    //     if(temp < minTemp){
    //         minTemp = temp;
    //     }
    //     if(temp > maxTemp){
    //         maxTemp = temp;
    //     }


    //     var date = new Date(tempdata1[i].datetime);
    //     var hours = date.getHours();

    //     // Minutes part from the timestamp
    //     var minutes = "0" + date.getMinutes();

    //     // Seconds part from the timestamp
    //     var seconds = "0" + date.getSeconds();

    //     // Will display time in 10:30:23 format
    //     var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    //     chartLabels1.push(formattedTime);
    // }

    // console.log("minTemp: " + minTemp);
    // console.log("maxTemp: " + maxTemp);

    // //console.log(tempArray);
    // const ctx0 = document.getElementById('tempChart0');
    // ctx0.innerHTML = "";
    
    // const ctx1 = document.getElementById('tempChart1');
    // ctx1.innerHTML = "";
  
    // let chart0 = createTemperatureChart(ctx0, tempArray0, chartLabels0, minTemp, maxTemp);
    // let chart1 = createTemperatureChart(ctx1, tempArray1, chartLabels1, minTemp, maxTemp);

    // setTimeout(() => {
    //     chart0.destroy();
    //     chart1.destroy();
    //     updateTemperatures();
    // }, "120000");
}


function createTemperatureChart(ctx, tempArray, chartLabels, minTemp, maxTemp){
    const data = {
        labels: chartLabels,
        datasets: [{
            label: 'temps',
            data: tempArray,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            pointRadius: 0,
        }]
    };
    let chrt = new Chart(ctx, {
        type: 'line',
        data: data,
  
         options: {
            layout: {
                padding: 0
            },
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: false
            },
            scales: {
                y: {
                    min: minTemp,
                    max: maxTemp,
                    grid: {
                        display: false
                    },
                    
                    border:{
                        display:false
                    }
                },
                x: {
                    ticks:{
                        display: false
                    },
                    grid: {
                        display: false
                    },
                    border:{
                        display:false
                    }
                }

            }
        }
    });

    console.log(chrt);
    return chrt;
}


async function loadTemperature(from, to, sensorId){
      console.log("Function: loadTemperature");
  const url = "/tempbazen//getData";

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

