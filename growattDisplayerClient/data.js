async function updateDataPage(plantdata){


    //last updates
    document.getElementById("last-local-update").innerHTML = getShowDateFormat(plantdata.Last_Local_Update);
    document.getElementById("last-server-update").innerHTML = getShowDateFormat(plantdata.timestamp);

    //temperature data
    let sensors = await loadAvaibleSensors();
    let config = await loadConfig();

    let lastUpdatesElement = document.getElementById("lastUpdates");
    for(i = 0; i < sensors.length; i++){
        let dataItem = document.createElement("div");
            dataItem.className = "data-item";

        let dataContent = document.createElement("div");
            dataContent.className = "data-content";

        let dataLabel = document.createElement("div");
            dataLabel.className = "data-label";
            let sensorName = null;
            //find sensor name in config json
            for(x = 0; x < config.sensorNames.length; x++){
                if(config.sensorNames[x].sensorId == sensors[i].sensorId){
                    sensorName = config.sensorNames[x].name;
                    break;
                }
            }

            dataLabel.innerHTML = `Teploměr ${sensorName} (${sensors[i].sensorId})`;
            
        let dataTrailing = document.createElement("div");
            dataTrailing.className = "data-trailing";
            dataTrailing.innerHTML = getShowDateFormat(sensors[i].datetime);



        lastUpdatesElement.appendChild(dataItem);
            dataItem.appendChild(dataContent);
                dataContent.appendChild(dataLabel);
            dataItem.appendChild(dataTrailing);
    }

    //power plant data
    for (const key in plantdata) {
            const element = document.getElementById(key);
            if (element) {
                const value = plantdata[key];
                const unit = element.getAttribute('data-unit') || '';
                // Update the text content with value and unit
                element.innerText = value + ' ' + unit;
            }
    }


    // document.getElementById("Battery_Discharged_Total").innerHTML = plantdata.Battery_Discharged_Total;
    // document.getElementById("Battery_Discharged_Today").innerHTML = plantdata.Battery_Discharged_Today;
    // document.getElementById("Battery_Charge_Now_Power").innerHTML = plantdata.Battery_Charge_Now_Power;
    // document.getElementById("Battery_Discharge_Now_Power").innerHTML = plantdata.Battery_Discharge_Now_Power;
    // document.getElementById("Battery_Percentage").innerHTML = plantdata.Battery_Percentage;
    // document.getElementById("Export_To_Grid_Now").innerHTML = plantdata.Export_To_Grid_Now;
    // document.getElementById("Export_To_Grid_Today").innerHTML = plantdata.Export_To_Grid_Today;
    // document.getElementById("Export_To_Grid_Total").innerHTML = plantdata.Export_To_Grid_Total;
    // document.getElementById("Import_From_Grid_Now").innerHTML = plantdata.Import_From_Grid_Now;
    // document.getElementById("Import_From_Grid_Today").innerHTML = plantdata.Import_From_Grid_Today;
    // document.getElementById("Import_From_Grid_Total").innerHTML = plantdata.Import_From_Grid_Total;
    // document.getElementById("Plant_Production_Now").innerHTML = plantdata.Plant_Production_Now;
    // document.getElementById("Plant_Production_Today").innerHTML = plantdata.Plant_Production_Today;
    // document.getElementById("Plant_Production_Total").innerHTML = plantdata.Plant_Production_Total;
    // document.getElementById("Total_energy_created").innerHTML = plantdata.Total_energy_created;
    // document.getElementById("Power_Consumption_Now").innerHTML = plantdata.Power_Consumption_Now;
    // document.getElementById("Power_Consumption_Today").innerHTML = plantdata.Power_Consumption_Today;
    // document.getElementById("Self_Power_Consumption_Today").innerHTML = plantdata.Self_Power_Consumption_Today;
    // document.getElementById("Battery_Voltage").innerHTML = plantdata.Battery_Voltage;
    // document.getElementById("Grid_Voltage").innerHTML = plantdata.Grid_Voltage;
    // document.getElementById("Grid_Frequency").innerHTML = plantdata.Grid_Frequency;
    // document.getElementById("First_MPPT_Voltage").innerHTML = plantdata.First_MPPT_Voltage;
    // document.getElementById("First_MPPT_Power").innerHTML = plantdata.First_MPPT_Power;
    // document.getElementById("Second_MPPT_Voltage").innerHTML = plantdata.Second_MPPT_Voltage;
    // document.getElementById("Second_MPPT_Power").innerHTML = plantdata.Second_MPPT_Power;



    //other
    document.getElementById("version").innerHTML = app_version;
    document.getElementById("theme").innerHTML = theme;
    
}