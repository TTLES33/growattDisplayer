const fs = require('node:fs').promises;

async function configSetSensorName(sensorId, name){
    const fileName = 'data/config.json';

    try{
        const data = await fs.readFile(fileName, 'utf8');
        let parsedData = JSON.parse(data);


        let sensorInFile = false;
        for(i = 0; i < parsedData.sensorNames.length; i++){
            if(parsedData.sensorNames[i].sensorId == sensorId){
                parsedData.sensorNames[i].name = name;
                sensorInFile = true;
                break;
            }
        }

        if(sensorInFile == false){
            parsedData.sensorNames.push(
                {
                    "sensorId": sensorId,
                    "name": name
                }
            )
        }

        await fs.writeFile(fileName, JSON.stringify(parsedData, null, 2), function writeJSON(err) {
        });

    } catch (err) {
        console.error("Error writing to config:", err);
        throw err; // Re-throw so the endpoint's catch block can catch it
    }
}

async function configRead(){
    try {
        const data = await fs.readFile('data/config.json', 'utf8');
        // console.log(data);
        return JSON.parse(data); // Parse it here so the endpoint gets an object
    } catch (err) {
        console.error("Error reading config:", err);
        throw err; // Re-throw so the endpoint's catch block can catch it
    }
}


async function configSetTheme(from, to){
    const fileName = 'data/config.json';
    
        try {
            let file = null;
            const data = await fs.readFile(fileName, 'utf8');
            file = JSON.parse(data);
            file.theme.from = from;
            file.theme.to = to;


            await fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                // console.log(JSON.stringify(file, null, 2));
            });
        } catch (err) {
            console.error("Error reading config:", err );
            throw err; // Re-throw so the endpoint's catch block can catch it
        }
}
    

module.exports = {configSetSensorName, configRead, configSetTheme};