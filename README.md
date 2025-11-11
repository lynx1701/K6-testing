# K6-testing

Load testing with K6 tooling

## TODOS:

1. Resolve /run function to work properly and access test.js

## Install

1. `docker build -t my-k6-api -f Dockerfile .`
2. Run image in Docker Desktop
3. Assign port 8080 to expose it
4. GET /health to see that its up.

## Run

1. Select POST method at /run

_Payload example:_

`{
  "method": "GET | POST | PUT | PATCH | DELETE",
  "host": "https://api.example.com",
  "endpoints": ["/health", "/status"],
  "scenario": "load | stress | spike | soak"
}`

2. Logs will be saved locally under logs.
