#!/bin/sh

# Check if the volume is empty (first run) and copy initial files if needed
if [ ! -f /home/node/app/data/config.json ]; then
  echo "Initializing persistent data volume..."
  cp /tmp/config.json.initial /home/node/app/data/config.json
  cp /tmp/tempDB.db.initial /home/node/app/data/tempDB.db
  chown -R node:node /home/node/app/data # Ensure correct permissions
fi

# Execute the main application command (index.js) as the "node" user
exec su-exec node "$@"