#!/bin/bash

# Run the build command
npm run build

# Start the application with PM2
node --es-module-specifier-resolution=node dist/index.js
