
module.exports = {insertTeplotaRow, selectTeplotaData, removeDB};
function insertTeplotaRow(sqlite3, teplota, sensorId){
    const db = new sqlite3.Database("bazenTeplotaDB");
    let curDate = Date.now();
    teplota = Number.parseFloat(teplota).toFixed(2);
    db.run('INSERT INTO teploty(teplota, datetime, sensorId) VALUES(?, ?, ?)', [teplota, curDate, sensorId], function (err) {
        if(err) {
            return console.log(err.message); 
        }
})
}

async function selectTeplotaData(sqlite3, from, to, sensorId){
    const db = new sqlite3.Database("bazenTeplotaDB"); 
    let sql = "SELECT datetime, teplota FROM teploty WHERE sensorId = " + sensorId + " AND datetime < " + to + " AND datetime > " + from + "  ORDER BY datetime DESC;"; 
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
     const db = new sqlite3.Database("bazenTeplotaDB"); 
    
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