async function removeTeplotyDB(){
      console.log("Function: removeTeplotyDB");
  const url = "/bazen/removeDB";

   try {
    const response = await fetch(url, {
            method: "GET"
    });
    if (!response.ok) {
      let response = `Response status: ${response.status}`;
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
        let response = `Response status: ${response.status}`;
        showError(response)
        throw new Error(response);
    }

    const json = await response.json();
    console.log(json.theme);
    config = json.theme;
    
    
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
