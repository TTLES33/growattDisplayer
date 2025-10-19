async function loadAllTemperatures(){
    console.log("loadAllTemperatures()");
      let tempSensors = await loadAvaibleSensors();
      	for(i = 0; i < tempSensors.length; i++){
		    let sensorDiv = document.createElement("div");
			sensorDiv.className = "sensorListItem";

            let sensorId = document.createElement("div");
            let sensorLastTemp = document.createElement("div");
                
            sensorId.innerHTML = "Id: " + tempSensors[i].sensorId;
            sensorLastTemp.innerHTML = tempSensors[i].teplota + "˚c";

            sensorDiv.appendChild(sensorId);
            sensorDiv.appendChild(sensorLastTemp);

            document.getElementById("tempsData").appendChild(sensorDiv);
        }
}