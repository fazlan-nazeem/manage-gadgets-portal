#!/bin/sh

echo "SIGN_IN_REDIRECT_URL=${SIGN_IN_REDIRECT_URL}"

# Replace environment variables in files
envsubst < /usr/src/app/src/template.env.js > /usr/src/app/public/configs/asgardeo/env-config.js

# Execute the CMD from the Dockerfile, e.g., starting your web server
exec "$@"
