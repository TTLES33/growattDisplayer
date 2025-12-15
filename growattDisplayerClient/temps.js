

let chartArr = [];


async function loadAllTemperatures(){
    console.log("loadAllTemperatures()");

    for(i = 0; i < chartArr.length; i++){
        chartArr[i].destroy();
    }
    chartArr = [];


    document.getElementById("tempsData").innerHTML = "";
      let tempSensors = await loadAvaibleSensors();
      let config = await loadConfig();

      console.log(tempSensors);
      console.log(tempSensors.length);
      	for(i = 0; i < tempSensors.length; i++){
            console.log(tempSensors[i]);
            let sensorId = tempSensors[i].sensorId;
            let sensorName = tempSensors[i].name;

		    let sensorContainer = document.createElement("div");
			sensorContainer.className = "sensorContainer";

            let gridName = document.createElement("div");
            gridName.className = "grid_name";
            gridName.innerHTML = "Undefined";
            gridName.onclick = function(){
                changeSensorName(sensorId, sensorName);
            }

            //find sensor name in config json
            for(x = 0; x < config.sensorNames.length; x++){
                if(config.sensorNames[x].sensorId == sensorId){
                    gridName.innerHTML = config.sensorNames[x].name;
                }
            }


            let gridTemp = document.createElement("div");
            gridTemp.className = "grid_temp";

            let gridTempValue = document.createElement("div");
            gridTempValue.innerHTML = Number(tempSensors[i].teplota).toFixed(1);
            gridTempValue.className = "gridTempValue";

            let celsius = document.createElement("div");
            celsius.className = "celsiusSign";
            celsius.innerHTML = "˚C";

            gridTemp.appendChild(gridTempValue);
            gridTemp.appendChild(celsius);

            let gridLine = document.createElement("div");
            gridLine.className = "grid_line";

                let line = document.createElement("div");
                line.className = "verticalLine";
            gridLine.appendChild(line);
            

            let gridGraph = document.createElement("canvas");
            gridGraph.className = "grid_graph";


            sensorContainer.appendChild(gridName);
            sensorContainer.appendChild(gridTemp);
            sensorContainer.appendChild(gridLine);
            sensorContainer.appendChild(gridGraph);

            document.getElementById("tempsData").appendChild(sensorContainer);
        
            createGraph(gridGraph, tempSensors[i].sensorId);
        }
}

async function createGraph(containerElement, sensorId){
    let currentDateTime = Date.now();
    let yesterdayDateTime = Date.now() - 1000 * 60 * 60 * 24;

    let tempdata = await loadTemperature(yesterdayDateTime, currentDateTime, sensorId);
    let tempArray = [];
    let chartLabels = [];

    let minTemp = Number.MAX_SAFE_INTEGER;
    let maxTemp = Number.MIN_SAFE_INTEGER;

    for(x = tempdata.length - 1; x >= 0; x=x-5){
        let temp = tempdata[x].teplota

        tempArray.push(parseFloat(temp));
        if(temp < minTemp){
            minTemp = temp;
        }
        if(temp > maxTemp){
            maxTemp = temp;
        }


        var date = new Date(tempdata[x].datetime);
        var hours = date.getHours();

        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();


        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2);

        chartLabels.push(formattedTime);
    }
    
    minTemp -= 1;
    maxTemp += 1;


    console.log("minTemp: " + minTemp);
    console.log("maxTemp: " + maxTemp);
    

    let chart = createTemperatureChart(containerElement, tempArray, chartLabels, minTemp, maxTemp);
   
    chartArr.push(chart);

}

function createTemperatureChart(ctx, tempArray, chartLabels, minTemp, maxTemp){
    // console.log(chartLabels);
    // console.log(tempArray);
    let chartColor = "white";
    if(theme == "light"){
        chartColor = "black";
    }
    const data = {
        labels: chartLabels,
        datasets: [{
            data: tempArray,
            fill: false,
            borderColor: chartColor,
            pointRadius: 0,
            tension: 0.1,
        }]
    };
    let chrt = new Chart(ctx, {
        type: 'line',
        data: data,
         options: {
            animation: false,
            layout: {
                padding: 0
            },
            maintainAspectRatio: false,
            plugins: {
                legend: false,
                decimation: {
                    enabled: true,
                    algorithm: 'min-max',
                }
            },
            scales: {
                y: {
                    min: minTemp,
                    max: maxTemp,
                    grid: {
                        display: false
                    },
                    ticks:{
                        color: chartColor,
                        callback: function (value) {
                            return Number(value).toFixed(1);
                        }
                    },
                    border:{
                        display:false
                    }
                },
                x: {
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

    // console.log(chrt);
    return chrt;
}

function changeSensorName(sensorId, sensorNameInput){
    let sensorName = prompt("Název teploměru " + sensorId, sensorNameInput); 

    fetch("/temp/setSensorName", {
    method: "POST",
    body: JSON.stringify({
        sensorId: sensorId,
        name: sensorName
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    });

    loadAllTemperatures();
}

