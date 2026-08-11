async function updateDataPage(plantdata){


    //last updates
    document.getElementById("last-local-update").innerHTML = getShowDateFormat(plantdata.Last_Local_Update);
    document.getElementById("last-server-update").innerHTML = getShowDateFormat(plantdata.timestamp);

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




    //other
    document.getElementById("version").innerHTML = app_version;
    document.getElementById("theme").innerHTML = theme;
    
}