#!/bin/bash

# Run the setup scripts
npm run build
npm run loc

# Generate the documentation
npx typedoc --options typedoc.json

# Start the application with PM2
node --es-module-specifier-resolution=node dist/bot/deploy.js
node --es-module-specifier-resolution=node dist/index.js
