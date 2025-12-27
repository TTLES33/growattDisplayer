const fs = require('node:fs').promises;

function configSetSensorName(sensorId, name){
    const fileName = 'data/config.json';

    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            throw err;
        }
        let file = JSON.parse(data);

        let sensorInFile = false;
        for(i = 0; i < file.sensorNames.length; i++){
            if(file.sensorNames[i].sensorId == sensorId){
                file.sensorNames[i].name = name;
                sensorInFile = true;
                break;
            }
        }

        if(sensorInFile == false){
            file.sensorNames.push(
                {
                    "sensorId": sensorId,
                    "name": name
                }
            )
        }

        fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
            if (err){
                console.log(err);
                throw err;
            }
            console.log(JSON.stringify(file, null, 2));
        });
    });
}

async function configRead(){
    try {
        const data = await fs.readFile('data/config.json', 'utf8');
        console.log(data);
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