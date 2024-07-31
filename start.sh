#!/bin/bash

# Run the build command
npm run build

# Generate wiki pages
npm run wiki

# Start the application with PM2
node --es-module-specifier-resolution=node dist/index.js
