var plantdata = {};
var activepage;
function screen(){
    alert(window.innerWidth);
    alert(window.innerHeight)
}

function loadData(){
    console.log("Function: loadData()")
    $.ajax({
        type: "GET",
        url: 'http://localhost:8081/plantdata',
        success: function (result) {
            plantdata = result;
            localStorage.setItem("plantdata", JSON.stringify(plantdata));
            console.log(plantdata);
            if(activepage == "index"){
                mainPageCreator();
            }else if(activepage == "data"){
                dataPageCreator()
            }
       
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        }
      });
}
function mainPageCreator(){

    console.log("function: mainPageCreator()");
    var battery_height = "calc(" + plantdata.Battery_Percentage + "% - 4px)";
    console.log(battery_height)
//battery

 document.getElementById("percentage").innerHTML = plantdata.Battery_Percentage;
 document.getElementById("battery-level").style.setProperty("height", battery_height) ;
 


 if(plantdata.Battery_Charge_Now_Power > 0){
    document.getElementById("battery_text").innerHTML = "nabíjení";
    document.getElementById("power").innerHTML = plantdata.Battery_Charge_Now_Power + "kW";
    for(i=0; i < document.getElementById("arrow_0").childNodes.length; i++ ){
        document.getElementById("arrow_0").childNodes[i].className = "arrow_top";
        document.getElementById("arrow_0").childNodes[i].style.borderBottomColor = "var(--arrow_green)";
        document.getElementById("arrow_0").childNodes[i].style.display = "block";
    }
 }else{
    if(plantdata.Battery_Discharge_Now_Power > 0){
        document.getElementById("battery_text").innerHTML = "vybíjení";
        document.getElementById("power").innerHTML = plantdata.Battery_Discharge_Now_Power + "kW";
        for(i=0; i < document.getElementById("arrow_0").childNodes.length; i++ ){
            console.log(document.getElementById("arrow_0"));
            document.getElementById("arrow_0").childNodes[i].className = "arrow_down";
            document.getElementById("arrow_0").childNodes[i].style.borderTopColor = "var(--arrow_red)";
            document.getElementById("arrow_0").childNodes[i].style.display = "block";
        }
    }else{
        document.getElementById("power").innerHTML = "0 kW";
        document.getElementById("battery_text").innerHTML = "";
        for(i=0; i < document.getElementById("arrow_0").childNodes.length; i++ ){
            console.log(i);
            document.getElementById("arrow_0").childNodes[i].style.display = "none";
        }
    }
   
 }

 //home
 document.getElementById("home_text").innerHTML = plantdata.Power_Consumption_Now + "kW";

 //plant
 document.getElementById("foto_text").innerHTML = plantdata.Plant_Production_Now;
 if(plantdata.Plant_Production_Now > 0){
    document.getElementById("foto_text").innerHTML = plantdata.Plant_Production_Now + "kW";
    for(i=0; i < document.getElementById("arrow_1").childNodes.length; i++ ){
        document.getElementById("arrow_1").childNodes[i].className = "arrow_right";
        document.getElementById("arrow_1").childNodes[i].style.borderLeftColor = "var(--arrow_green)";
        document.getElementById("arrow_1").childNodes[i].style.display = "block";
    }
 }else{
    document.getElementById("foto_text").innerHTML = "0 kW";
    for(i=0; i < document.getElementById("arrow_1").childNodes.length; i++ ){
        document.getElementById("arrow_1").childNodes[i].style.display = "none";
    }
 }

 //grid
 if(plantdata.ExportToGrid <= 0){
    document.getElementById("grid_nadpis").innerHTML = "Import";
    document.getElementById("grid_text").innerHTML = plantdata.Import_From_Grid_Now + " kW";
    for(i=0; i < document.getElementById("arrow_2").childNodes.length - 1; i++ ){
        document.getElementById("arrow_2").childNodes[i].className = "arrow_top";
        document.getElementById("arrow_2").childNodes[i].style.borderBottomColor = "var(--arrow_red)";
    }
 }else{
    document.getElementById("grid_nadpis").innerHTML = "Export";
    document.getElementById("grid_text").innerHTML = plantdata.Export_To_Grid_Now + " kW";
    
    for(i=0; i < document.getElementById("arrow_2").childNodes.length - 1; i++ ){
        document.getElementById("arrow_2").childNodes[i].className = "arrow_down";
        document.getElementById("arrow_2").childNodes[i].style.borderTopColor = "var(--arrow_green)";
    }
 }
 


 document.getElementById("loadingDiv").style.display = "none";
 document.getElementById("container").style.display = "grid";
}

function dataPageCreator(){
    console.log("function: dataPageCreator()");
    for(i=0; i< Object.keys(plantdata).length; i++){
        console.log(Object.keys(plantdata)[i]);
        console.log(plantdata[Object.keys(plantdata)[i]]);
        document.getElementById(Object.keys(plantdata)[i]).innerHTML = plantdata[Object.keys(plantdata)[i]];
    }
}
function autoupdater(){
    console.log("function: autoupdater()");
    setInterval(function(){
        loadData();
    }, 120000)
}

function onloadfnc(){
    if (localStorage.getItem("plantdata") !== null) {
        plantdata = JSON.parse(localStorage.getItem("plantdata"));
        var olddate = new Date(plantdata.Last_Data_Update);
        var nowdate = new Date();
        var minutesdiff = Math.floor(((nowdate - olddate)/1000)/60);
        console.log(minutesdiff);
            if(minutesdiff >= 5){
                loadData();
                autoupdater();
            }else{
                if(activepage == "index"){
                    mainPageCreator();
                }else if(activepage == "data"){
                    dataPageCreator()
                }
                autoupdater()
            }
        }else{
        loadData();
        autoupdater();
        }

}

