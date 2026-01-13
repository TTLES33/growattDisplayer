let sensorsArray = [];


async function removeTeplotyDB(){
      console.log("Function: removeTeplotyDB");
  const url = "/temp/removeDB";

   try {
    const response = await fetch(url, {
            method: "GET"
    });
    if (!response.ok) {
      let response = `[removeTeplotyDB] Response status: ${response.status}`;
        showError(response)
        throw new Error(response);
    }

    alert("deleted");
  } catch (error) {
    console.error(error.message);
    showError(error.message);
  } 
}

function configThemeChange(){
    let fromInput = document.getElementById("settTimeFrom").valueAsNumber;
    let toInput = document.getElementById("settTimeTo").valueAsNumber;

    if(fromInput != NaN){
        config.from = fromInput;
        updateCongig();
        checkForAutoThemeChange();
    }

    if(toInput != NaN){
        config.to = toInput;
        updateCongig();
        checkForAutoThemeChange();
    }
}

async function loadConfig(){
  console.log("Function: loadConfig");
  const url = "/config";
  try {
    const response = await fetch(url);
    if (!response.ok) {
        let response = `[loadConfig] Response status: ${response.status}`;
        showError(response)
        throw new Error(response);
    }

    const json = await response.json();
    console.log(json);
    config = json.theme;
    sensorsArray = json.sensorNames;
    
    return json;
    
  } catch (error) {
    console.error(error.message);
     showError(error.message)
  }

}

function updateCongig(){
    console.log("Function: updateCongig");
    fetch("/config/set/theme", {
    method: "POST",
    body: JSON.stringify({
        from: config.from,
        to: config.to
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    });
}

async function renderAvaibleSensors(){
  let tempSensors = await loadAvaibleSensors();
  document.getElementById("avaibleTempSensors").innerHTML = "";


	for(i = 0; i < tempSensors.length; i++){
		let sensorDiv = document.createElement("div");
			sensorDiv.className = "sensorListItem";

    let currnetSensordFromConfig = {
      "priority": 999,
      "name": "Undefined"
    };
    for(x = 0; x < sensorsArray.length; x++){
      if(sensorsArray[x].sensorId == tempSensors[i].sensorId){
        currnetSensordFromConfig = sensorsArray[x];
        break;
      }
    }
		
		let sensorId = document.createElement("div");
		let sensorName = document.createElement("div");
		let sensorPriority = document.createElement("div");
		let sensorLastTemp = document.createElement("div");
		let sensorLastTime = document.createElement("div");
    let bttnContainer = document.createElement("div");
      bttnContainer.classList.add("sensorsBttns");

    let editNameBtn = document.createElement("input");
    let editPriorityBtn = document.createElement("input");

		sensorId.innerHTML = "Id: " + tempSensors[i].sensorId;
    sensorName.innerHTML = "Název: " + currnetSensordFromConfig.name;
    sensorPriority.innerHTML = "Priorita: " + currnetSensordFromConfig.priority;
		sensorLastTemp.innerHTML = "Teplota: " + tempSensors[i].teplota + "˚c";
		sensorLastTime.innerHTML = "Last update: " + getShowDateFormat(new Date(tempSensors[i].datetime));


    editNameBtn.type = "button";
    editNameBtn.onclick = async function (){
      await changeSensorName(currnetSensordFromConfig.sensorId, currnetSensordFromConfig.name);
      await loadConfig();
      await renderAvaibleSensors();
    }
    editNameBtn.value = "Změnit jméno";

    editPriorityBtn.type = "button";
    editPriorityBtn.onclick = async function (){
      await changeSensorPriority(currnetSensordFromConfig.sensorId, currnetSensordFromConfig.priority);
      await loadConfig();
      await renderAvaibleSensors();
    }
    editPriorityBtn.value = "Změnit prioritu";

		sensorDiv.appendChild(sensorName);
		sensorDiv.appendChild(sensorPriority);
    sensorDiv.appendChild(sensorId);
		sensorDiv.appendChild(sensorLastTemp);
		sensorDiv.appendChild(sensorLastTime);
		sensorDiv.appendChild(bttnContainer);


    bttnContainer.appendChild(editNameBtn);
    bttnContainer.appendChild(editPriorityBtn);

		document.getElementById("avaibleTempSensors").appendChild(sensorDiv);
	}

}



async function loadAvaibleSensors(){
	const url = "/temp/getSensors";
  	try {
    	const response = await fetch(url);
		if (!response.ok) {
			let response = `[loadAvaibleSensor] Response status: ${response.status}`;
			showError(response)
			throw new Error(response);
		}

		const json = await response.json();
		console.log(json);
		return json;
    
	} catch (error) {
		console.error(error.message);
		showError(error.message)
	}

}
