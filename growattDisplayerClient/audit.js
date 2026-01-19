


function loadAuditData(){
    $.ajax({
        type: "GET",
        url: '/truenas/getData',
        success: function (result) {
            let auditData = result;

            // --- 3. INIT ---
            renderStorage(auditData);
            renderAlerts(auditData);
            renderApps(auditData);

            setTimeout(() => {
                if(activepage === 'audit'){
                    loadAuditData();
                }
            }, "10000");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            showError(thrownError);
            setTimeout(() => {
                if(activepage === 'audit'){
                    loadAuditData();
                }
            }, "5000");
        }
    });
}



function renderStorage(apiData) {
    const container = document.getElementById("storage-container");
    container.innerHTML = "";

    apiData.storage.forEach((pool) => {
        const card = document.createElement("div");
        card.className = "card";

        // Determine Pool Status Color
        const isHealthy = pool.status === "ONLINE" && pool.healthy;
        const statusClass = isHealthy ? "badge-ok" : "badge-warn";

        // Date Parsing for Scan
        const scanDate = getShowDateFormat(new Date(pool.scan.end_time.$date));

        // Build Disk List
        let disksHtml = "";
        if (pool.topology && pool.topology.data) {
            pool.topology.data.forEach((vdev) => {

                vdev.children.forEach((disk) => {

                    const diskStatusColor =
                        disk.status === "ONLINE"
                            ? "var(--md-sys-color-primary)"
                            : "var(--md-sys-color-error)";
                    disksHtml += `
                                <div class="disk-item" style="border-color: ${diskStatusColor}">
                                    <div style="font-weight:bold; color:${diskStatusColor}">${disk.disk}</div>
                                    <div>${disk.status}</div>
                                    <div><small>${disk.stats.read_errors} read errors</small></div>
                                    <div><small>${disk.stats.write_errors} write errors</small></div>
                                    <div><small>${disk.stats.checksum_errors} checksum errors</small></div>
                                </div>
                            `;
                });
            });
        }

        card.innerHTML = `
                    <div class="card-header">
                        <span class="card-title">${pool.name}</span>
                        <span class="badge ${statusClass}">${pool.status}</span>
                    </div>
                    <div class="scan-info">
                        <strong>Last Scan:</strong> ${pool.scan.function} (${pool.scan.state})<br>
                        <div><small>Errors:${pool.scan.errors}</small></div>
                        <div><small>${scanDate}</small></div>
                    </div>
                    <div class="disk-grid">
                        ${disksHtml}
                    </div>
                `;
        container.appendChild(card);
    });
}

function renderAlerts(apiData) {
    const container = document.getElementById("alerts-container");
    container.innerHTML = "";

    apiData.alerts.forEach((alert) => {
        const el = document.createElement("div");

        // Determine styling based on state
        let classes = "alert-item";
        if (!alert.dismissed) classes += " active";
        if (alert.level === "CRITICAL") classes += " critical";

        const dateStr = getShowDateFormat(new Date(alert.datetime.$date));
        const source = alert.source ? alert.source : "System";

        el.className = classes;
        el.innerHTML = `
                    <div class="alert-meta">
                        <span>${source} &bull; ${alert.level}</span>
                        <span>${dateStr}</span>
                    </div>
                    <div>${alert.formatted}</div>
                `;
        container.appendChild(el);
    });
}

function renderApps(apiData) {
    const container = document.getElementById("apps-container");
    container.innerHTML = "";

    apiData.app.forEach((app) => {
        const card = document.createElement("div");
        card.className = "app-row";

        const updateHtml = app.upgrade_available
            ? `<span class="update-avail">Update Available</span>`
            : "";

        const stateClass =
            app.state === "RUNNING" ? "badge-ok" : "badge-neutral";

        card.innerHTML = `
                    <div>
                        <div class="card-title"><img width="16" height="16" src="${app.metadata.icon}"> ${app.name}</div>
                        ${updateHtml}
                        <small style="opacity:0.7">${app.human_version}</small>
                    </div>
                    <span class="badge ${stateClass}">${app.state}</span>
                `;
        container.appendChild(card);
    });
}

