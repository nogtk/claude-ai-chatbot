#!/bin/bash
set -e

# Wait for MongoDB to be ready
sleep 5

# Initialize the replica set
mongosh --eval "rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongodb:27017' }
  ]
})" 2>/dev/null || true

# Wait for replica set to be ready
for i in {1..30}; do
  if mongosh --eval "rs.status()" 2>/dev/null | grep -q '"ok"'; then
    echo "Replica set initialized successfully"
    exit 0
  fi
  echo "Waiting for replica set to be ready... ($i/30)"
  sleep 1
done

echo "Warning: Replica set may not have initialized successfully"
exit 0
