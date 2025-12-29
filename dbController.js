
module.exports = {insertTeplotaRow, selectTeplotaData, selectSensors, removeDB};

const dbName = 'data/tempDB.db';
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

async function updateDBStructure(){
    const db = new sqlite3.Database(dbName); 
    const sql = `CREATE INDEX IF NOT EXISTS idx_sensor_id_timestamp ON teploty (sensorId, datetime);`;
    try{
        db.run(sql);
    }catch(err){
        console.log(err);
    }
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
    let sql = "SELECT t1.* FROM teploty t1 INNER JOIN (SELECT sensorId, MAX(datetime) AS max_datetime FROM teploty GROUP BY sensorId) t2 ON t1.sensorId = t2.sensorId AND t1.datetime = t2.max_datetime;"; 
    try {
        const products = await fetchAll(db, sql);
        return products;
    } catch (err) {
        console.log(err);
    } finally {
        db.close();
    } 
}

async function removeDB(sqlite3) {
     const db = new sqlite3.Database(dbName); 
    
    try {
        db.run(`DELETE FROM teploty`, function(err) {
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