let minTemp = Number.MAX_SAFE_INTEGER;
let maxTemp = Number.MIN_SAFE_INTEGER;

let chartArr = [];


async function loadAllTemperatures(){
    console.log("loadAllTemperatures()");

    for(i = 0; i < chartArr.length; i++){
        chartArr[i].destroy();
    }
    chartArr = [];


    document.getElementById("tempsData").innerHTML = "";
      let tempSensors = await loadAvaibleSensors();
      console.log(tempSensors);
      console.log(tempSensors.length);
      	for(i = 0; i < tempSensors.length; i++){
            console.log(tempSensors[i]);
		    let sensorContainer = document.createElement("div");
			sensorContainer.className = "sensorContainer";

            let gridName = document.createElement("div");
            gridName.className = "grid_name";
            gridName.innerHTML = "Vevnitř";

            let gridTemp = document.createElement("div");
            gridTemp.className = "grid_temp";
            gridTemp.innerHTML = tempSensors[i].teplota;

            let gridLine = document.createElement("div");
            gridLine.className = "grid_line";

                let line = document.createElement("div");
                line.className = "verticalLine";
            gridLine.appendChild(line);
            

            let gridGraph = document.createElement("div");
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

    for(x = tempdata.length - 1; x >= 0; x--){
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

        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        chartLabels.push(formattedTime);
    }
    
    console.log("minTemp: " + minTemp);
    console.log("maxTemp: " + maxTemp);
    

  //  let chart = createTemperatureChart(containerElement, tempArray, chartLabels, minTemp, maxTemp);
   
    //chartArr.push(chart);

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



