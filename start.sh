#!/bin/bash

# Run the build command
npm run build

# Build the docs & start server
npx typedoc --options typedoc.json
npx http-server --port 3334 docs/

# Start the application with PM2
node --es-module-specifier-resolution=node dist/index.js
