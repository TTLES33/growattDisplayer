
module.exports = {insertTeplotaRow, selectTeplotaData, selectSensors, removeDB, updateDBStructure, insertPlantdataRow, readLastPlantData};


const sqlite3 = require("sqlite3");
const {configRead} = require("./file_controller");
const dbName = 'data/tempDB.db';

//********************************************** */
//                  TEPLOTY
//********************************************** */
function insertTeplotaRow(sqlite3, teplota, sensorId){
    const db = new sqlite3.Database(dbName);
    let curDate = Date.now();
    teplota = Number.parseFloat(teplota).toFixed(2);
    db.run('INSERT INTO teploty(teplota, datetime, sensorId) VALUES(?, ?, ?)', [teplota, curDate, sensorId], function (err) {
        if(err) {
            return console.log(err.message);
        }
    })
}

async function selectTeplotaData(sqlite3, from, to, sensorId){
    const db = new sqlite3.Database(dbName);
    // let sql = "SELECT datetime, teplota FROM teploty WHERE sensorId = " + sensorId + " AND datetime < " + to + " AND datetime > " + from + "  ORDER BY datetime DESC;";
    const hour_difference = (to - from) / 1000 / 60 / 60;   //difference in hours between timestamps
    const interval = Math.round(hour_difference / 24);    //once in every {interval} minutes
    const inverval_seconds = interval * 60;
    const sql = `
        WITH RECURSIVE
                
            timeline(bucket_ts) AS (
                SELECT (${from} / 1000) / 60 * 60 
                UNION ALL
                SELECT bucket_ts + ${inverval_seconds}
                FROM timeline
                WHERE bucket_ts <  (${to} / 1000) / 60 * 60
            )
            -- 2. Join the timeline with your actual sensor data
            SELECT 
                datetime(t.bucket_ts, 'unixepoch', 'localtime') AS time_label,
                ROUND(AVG(s.teplota), 2) AS avg_temp,
				ROUND(AVG(s.teplota) OVER (),2) AS avg_temp_overall
            FROM timeline t
            LEFT JOIN teploty s ON 
                s.sensorId = ${sensorId} AND
                s.datetime >= (t.bucket_ts * 1000) AND 
                s.datetime < ((t.bucket_ts + ${inverval_seconds}) * 1000)
            GROUP BY t.bucket_ts
            ORDER BY t.bucket_ts ASC;
    `;
    try {
        const products = await fetchAll(db, sql);
        return products;
    } catch (err) {
        console.log(err);
    } finally {
        db.close();
    }
}

async function selectSensors(sqlite3){
    const db = new sqlite3.Database(dbName);
    let orderCommand = " ORDER BY CASE t1.sensorId ";
    let config = await configRead();
    for(const sensor of config.sensorNames){
        orderCommand += `WHEN ${sensor.sensorId} THEN ${sensor.priority} `;
    }
    orderCommand += "ELSE 999 END ASC;";

    let sql = "SELECT t1.* FROM teploty t1 INNER JOIN (SELECT sensorId, MAX(datetime) AS max_datetime FROM teploty GROUP BY sensorId) t2 ON t1.sensorId = t2.sensorId AND t1.datetime = t2.max_datetime";
    sql += orderCommand;

    console.log(sql);
    try {
        const products = await fetchAll(db, sql);
        return products;
    } catch (err) {
        console.log(err);
    } finally {
        db.close();
    }
}

//********************************************** */
//                  PLANTDATA
//********************************************** */
function insertPlantdataRow(sqlite3, plantdata){
    let curDate = Date.now();
    const db = new sqlite3.Database(dbName);
    const dbColumns = Object.keys(plantdata).map(key => `"${key}"`).join(', ');

    const values = Object.values(plantdata).map(val => {
        if (val === null || val === undefined) return "NULL";

        //escape string for SQL
        if (typeof val === "string"){
            return `'${val.replace(/'/g, "''")}'`;
        }
        return val;
    }).join(", ");

    const sqlCommand = `INSERT INTO growatt_data (${dbColumns}, timestamp) VALUES (${values}, ${curDate});`;

    db.run(sqlCommand, function (err) {
        if(err) {
            return console.log(err.message);
        }
    })
}

async function readLastPlantData(sqlite3){
    const db = new sqlite3.Database(dbName);
    let sql = "SELECT * FROM growatt_data ORDER BY timestamp DESC LIMIT 1";
    try {
        const products = await fetchAll(db, sql);
        return products[0];
    } catch (err) {
        console.log(err);
    } finally {
        db.close();
    }
}

//********************************************** */
//                  MISC
//********************************************** */

async function updateDBStructure(){
    const db = new sqlite3.Database(dbName);
    const sql = `CREATE INDEX IF NOT EXISTS idx_sensor_id_timestamp ON teploty (sensorId, datetime);`;
    const sql2 = ` CREATE TABLE IF NOT EXISTS "growatt_data"
    (
        "Ppv"                REAL             DEFAULT null,
        "Vpv1"               REAL             DEFAULT null,
        "PV1Curr"            REAL             DEFAULT null,
        "Ppv1"               REAL             DEFAULT null,
        "Pac"                REAL             DEFAULT null,
        "Fac"                REAL             DEFAULT null,
        "Vac1"               REAL             DEFAULT null,
        "Iac1"               REAL             DEFAULT null,
        "Pac1"               REAL             DEFAULT null,
        "Vac2"               REAL             DEFAULT null,
        "Iac2"               REAL             DEFAULT null,
        "Pac2"               REAL             DEFAULT null,
        "Vac3"               REAL             DEFAULT null,
        "Iac3"               REAL             DEFAULT null,
        "Pac3"               REAL             DEFAULT null,
        "Vac_RS"             REAL             DEFAULT null,
        "Vac_ST"             REAL             DEFAULT null,
        "Vac_TR"             REAL             DEFAULT null,
        "Eac_today"          REAL             DEFAULT null,
        "Eac_total"          REAL             DEFAULT null,
        "Time_total"         REAL             DEFAULT null,
        "Epv1_today"         REAL             DEFAULT null,
        "Epv_total"          REAL             DEFAULT null,
        "Temp1"              REAL             DEFAULT null,
        "RealOPPercent"      REAL             DEFAULT null,
        "FaultMaincode"      REAL             DEFAULT null,
        "Pdischarge1"        REAL             DEFAULT null,
        "Pcharge1"           REAL             DEFAULT null,
        "Vbat"               REAL             DEFAULT null,
        "SOC"                REAL             DEFAULT null,
        "Pac_to_user_Total"  REAL             DEFAULT null,
        "Pac_to_grid"        REAL             DEFAULT null,
        "BatteryTemperature" REAL             DEFAULT null,
        "Etouser_today"      REAL             DEFAULT null,
        "Etouser_total"      REAL             DEFAULT null,
        "Etogrid_today"      REAL             DEFAULT null,
        "Etogrid_total"      REAL             DEFAULT null,
        "Edischarge1_today"  REAL             DEFAULT null,
        "Edischarge1_total"  REAL             DEFAULT null,
        "Echarge1_today"     REAL             DEFAULT null,
        "Echarge1_total"     REAL             DEFAULT null,
        "ELocalLoad_Today"   REAL             DEFAULT null,
        "ELocalLoad_Total"   REAL             DEFAULT null,
        "Esystem_today"      REAL             DEFAULT null,
        "Esystem_total"      REAL             DEFAULT null,
        "Eself_today"        REAL             DEFAULT null,
        "Eself_total"        REAL             DEFAULT null,
        "PSystem"            REAL             DEFAULT null,
        "PSelf"              REAL             DEFAULT null,
        "timestamp"          INTEGER NOT NULL DEFAULT null,
        "Pac_to_grid_total"  REAL             DEFAULT null,
        "Epv1_total"         REAL             DEFAULT null,
        "ACChargePower"      REAL             DEFAULT null,
        "ACCharge_today"     REAL             DEFAULT null,
        "inverter_status"    INTEGER          DEFAULT null,
        "Pac_to_user"        REAL             DEFAULT null,
        "PLocalLoad"         REAL             DEFAULT null,
        "PLocalLoad_total"   REAL             DEFAULT null,
        PRIMARY KEY ("timestamp")
    )`;
    try{
        // db.run(sql);
        db.run(sql, function(err) {
            if (err) {
                return console.error(err.message);
            }
        });

        db.run(sql2, function(err) {
            if (err) {
                return console.error(err.message);
            }
        });
        return ;
    }catch(err){
        console.log(err);
    }
}



async function removeDB(sqlite3) {
    const db = new sqlite3.Database(dbName);

    try {
        db.run(`DELETE FROM teploty; DELETE FROM growatt_data;`, function(err) {
            if (err) {
                return console.error(err.message);
            }
        });
    } catch (err) {
        console.log(err);
    } finally {
        db.close();
    }

}
const fetchAll = async (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};