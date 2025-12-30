

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
	for(i = 0; i < tempSensors.length; i++){
		let sensorDiv = document.createElement("div");
			sensorDiv.className = "sensorListItem";
		
		let sensorId = document.createElement("div");
		let sensorLastTemp = document.createElement("div");
		let sensorLastTime = document.createElement("div");
			
		sensorId.innerHTML = "Id: " + tempSensors[i].sensorId;
		sensorLastTemp.innerHTML = tempSensors[i].teplota + "˚c";
		sensorLastTime.innerHTML = "last update: " + new Date(tempSensors[i].datetime).toString();

		sensorDiv.appendChild(sensorId);
		sensorDiv.appendChild(sensorLastTemp);
		sensorDiv.appendChild(sensorLastTime);

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
