async function updateDataPage(plantdata){

    plantdata = {
        "Ppv": 0,
        "Vpv1": 0,
        "PV1Curr": 0,
        "Ppv1": 0,
        "Pac": 0,
        "Fac": 49.99,
        "Vac1": 407.6,
        "Iac1": 0.6,
        "Pac1": 452.5,
        "Vac2": 412.2,
        "Iac2": 0.6,
        "Pac2": 0,
        "Vac3": 403.6,
        "Iac3": 0.6,
        "Pac3": 0,
        "Vac_RS": 0,
        "Vac_ST": 0,
        "Vac_TR": 0,
        "Eac_today": 0.4,
        "Eac_total": 24634.2,
        "Time_total": 99541180,
        "Epv1_today": 0,
        "Epv_total": 26290.6,
        "Temp1": 32.9,
        "RealOPPercent": 0,
        "FaultMaincode": 0,
        "Pdischarge1": 0,
        "Pcharge1": 0,
        "Vbat": 202.9,
        "SOC": 8,
        "Pac_to_user_Total": 560,
        "Pac_to_grid": 0,
        "BatteryTemperature": 21.2,
        "Etouser_today": 8.8,
        "Etouser_total": 6849.5,
        "Etogrid_today": 0,
        "Etogrid_total": 12411.2,
        "Edischarge1_today": 0,
        "Edischarge1_total": 6237,
        "Echarge1_today": 0,
        "Echarge1_total": 6596.8,
        "ELocalLoad_Today": 8.7,
        "ELocalLoad_Total": 20348.9,
        "Esystem_today": 0,
        "Esystem_total": 26037.8,
        "Eself_today": 0,
        "Eself_total": 13704.9,
        "PSystem": 0,
        "PSelf": 0,
        "timestamp": 1768310521527,
        "Pac_to_grid_total": 0,
        "Epv1_total": 12182.4,
        "ACChargePower": 1559,
        "ACCharge_today": 20,
        "inverter_status": 6,
        "Pac_to_user": 540,
        "PLocalLoad": 520,
        "PLocalLoad_total": 510
    };

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