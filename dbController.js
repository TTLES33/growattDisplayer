
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

async function selectTeplotaData(sqlite3, from, to, sensorId){
    const db = new sqlite3.Database(dbName); 
    // let sql = "SELECT datetime, teplota FROM teploty WHERE sensorId = " + sensorId + " AND datetime < " + to + " AND datetime > " + from + "  ORDER BY datetime DESC;"; 
    const hour_difference = (to - from) / 1000 / 60 / 60;   //difference in hours between timestamps
    const interval = Math.round(hour_difference / 24);    //once in every {interval} minutes
    const inverval_seconds = interval * 60;
    const sql = `
        WITH RECURSIVE
        -- 1. Create a list of timestamps for every minute of the last 24 hours
        params AS (
            SELECT 
            ${from} AS start_time, 
            ${to} AS end_time,
            ${inverval_seconds} AS interval_sec
        ),
            timeline(bucket_ts) AS (
                SELECT (start_time / 1000) / 60 * 60 FROM params
                UNION ALL
                SELECT bucket_ts + (SELECT interval_sec FROM params) FROM timeline
                WHERE bucket_ts < (SELECT (end_time / 1000) / 60 * 60 FROM params)
        ),
            recent_data AS (
                SELECT timestamp, temperature 
                FROM sensor_data 
                WHERE timestamp >= (SELECT start_time FROM params)
                    AND timestamp <= (SELECT end_time FROM params)
        )
        -- 2. Join the timeline with your actual sensor data
        SELECT 
            datetime(t.bucket_ts, 'unixepoch', 'localtime') AS time_label,
            AVG(s.teplota) AS avg_temp
        FROM timeline t
        LEFT JOIN teploty s ON 
            s.datetime >= (t.bucket_ts * 1000) AND 
            s.datetime < ((t.bucket_ts + (SELECT interval_sec FROM params)) * 1000)
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