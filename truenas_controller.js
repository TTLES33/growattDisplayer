
module.exports = {getTruenasData};
const { loadEnvFile } = require('node:process');
loadEnvFile('setup.env');

// helper to fetch data from TrueNAS
async function getTrueNASData(endpoint) {
    const url = `${process.env.TRUENAS_API_URL}${endpoint}`;

    // Options for the fetch request
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TRUENAS_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

async function getTruenasData() {
    let truenasObject = {};
        truenasObject.storage = await getTrueNASData('/pool');
        truenasObject.alerts = await getTrueNASData('/alert/list');
        truenasObject.app = await getTrueNASData('/app');

    return truenasObject;
}








/**
 * 1. Get List of Alerts
 */
async function getAlerts() {
    const data = await getTrueNASData('/alert/list');

    return data;
    // if (data && data.length > 0) {
    //     data.forEach(alert => {
    //         // Formatting output: Level - Message
    //         console.log(`[${alert.level}] ${alert.formatted}`);
    //     });
    // } else if (data) {
    //     console.log("✅ No active alerts.");
    // }
}

/**
 * 2. Get Applications (SCALE) / Plugins (CORE)
 * Note: 'chart/release' is used for TrueNAS SCALE Apps.
 * If using CORE, you might need '/plugin' or '/jail'.
 */
async function getApplications() {
    const data = await getTrueNASData('/app');
    return data;
    // if (data && data.length > 0) {
    //     data.forEach(app => {
    //         console.log(`- ${app.name} (Status: ${app.status}) | Ver: ${app.human_version}`);
    //     });
    // } else if (data) {
    //     console.log("ℹ️ No applications found (or this is TrueNAS CORE).");
    // }
}

/**
 * 4. Get Storage Health (Pools)
 */
async function getStorageHealth() {
    console.log('\n--- Storage Pools Health ---');
    const data = await getTrueNASData('/pool');
    return data;
    // if (data && data.length > 0) {
    //     data.forEach(pool => {
    //         const healthSymbol = pool.status === 'ONLINE' ? '✅' : '⚠️';
    //         console.log(`${healthSymbol} Pool: ${pool.name}`);
    //         console.log(`   Status: ${pool.status}`);
    //         // Convert bytes to TiB for readability (approximate)
    //         const usedTiB = (pool.size - pool.free) / (1024**4);
    //         const totalTiB = pool.size / (1024**4);
    //         console.log(`   Usage: ${usedTiB.toFixed(2)} TiB / ${totalTiB.toFixed(2)} TiB`);
    //     });
    // } else if (data) {
    //     console.log("⚠️ No storage pools found.");
    // }
}

/**
 * Main Execution Function
 */


