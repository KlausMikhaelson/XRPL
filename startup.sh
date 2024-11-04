#!/bin/bash

# Navigate to the server directory and start the server
echo "Starting server..."
cd server
npm start &

# Navigate to the client directory and start the client
echo "Starting client..."
cd ../client
npm start &

# Wait for both processes to finish
wait
