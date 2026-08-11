let sensorsArray = [];


async function removeTeplotyDB(){
  console.log("Function: removeTeplotyDB");
  const url = baseURL + "/temp/removeDB";

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

async function deleteSensor(sensorId){
  console.log("Function: deleteSensor");
  const url = baseURL + "/temp/deleteSensor";
  console.log(sensorId);

  try {
    const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
            sensorId: sensorId
        })
    });
    if (!response.ok) {
      let response = `[removeTeplotyDB] Response status: ${response.status}`;
        showError(response)
        throw new Error(response);
    }

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
  const url = baseURL+ "/config";
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

  // console.log(tempSensors); //senzory z databáze
  // console.log(sensorsArray);  //senzory z configu ( s nastavenou prioritou a jménem)

	for(i = 0; i < tempSensors.length; i++){
    let currentSensor = tempSensors[i];
		let sensorDiv = document.createElement("div");
			sensorDiv.className = "sensorListItem";

    let currnetSensordFromConfig = {
      "priority": 999,
      "name": "Undefined",
      "sensorId": currentSensor.sensorId
    };
    for(x = 0; x < sensorsArray.length; x++){
      if(sensorsArray[x].sensorId == currentSensor.sensorId){
        currnetSensordFromConfig = sensorsArray[x];
        break;
      }
    }
		
    console.log(currnetSensordFromConfig);

		let sensorId = document.createElement("div");
		let sensorName = document.createElement("div");
		let sensorPriority = document.createElement("div");
		let sensorLastTemp = document.createElement("div");
		let sensorLastTime = document.createElement("div");
    let bttnContainer = document.createElement("div");
      bttnContainer.classList.add("sensorsBttns");

    let editNameBtn = document.createElement("input");
    let editPriorityBtn = document.createElement("input");
    let deleteBtn = document.createElement("input");

		sensorId.innerHTML = "Id: " + currentSensor.sensorId;
    sensorName.innerHTML = "Název: " + currnetSensordFromConfig.name;
    sensorPriority.innerHTML = "Priorita: " + currnetSensordFromConfig.priority;
		sensorLastTemp.innerHTML = "Teplota: " + currentSensor.teplota + "˚c";
		sensorLastTime.innerHTML = "Last update: " + getShowDateFormat(new Date(currentSensor.datetime));


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

    deleteBtn.type = "button";
    deleteBtn.onclick = async function (){
      console.log(currnetSensordFromConfig);
      await deleteSensor(currnetSensordFromConfig.sensorId);
      await loadConfig();
      await renderAvaibleSensors();
    }
    deleteBtn.value = "Smazat senzor";
    deleteBtn.classList.add("dangerousBttn");

		sensorDiv.appendChild(sensorName);
		sensorDiv.appendChild(sensorPriority);
    sensorDiv.appendChild(sensorId);
		sensorDiv.appendChild(sensorLastTemp);
		sensorDiv.appendChild(sensorLastTime);
		sensorDiv.appendChild(bttnContainer);


    bttnContainer.appendChild(editNameBtn);
    bttnContainer.appendChild(editPriorityBtn);
    bttnContainer.appendChild(deleteBtn);

		document.getElementById("avaibleTempSensors").appendChild(sensorDiv);
	}

}



async function loadAvaibleSensors(){
	const url = baseURL + "/temp/getSensors";
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
