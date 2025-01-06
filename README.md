# Instructions to run the project

## Server instructions
### Set next environment variables

Server port
```
PORT
```
Database host
```
DB_SERVER
```
Database port
```
DB_PORT
```
Database name
```
DB_NAME
```
Database user
```
DB_USER
```
Database password
```
DB_PWD
```
Path to save received event file (e.g /home/test/receivedEvents.jsonl)
```
RECEIVED_EVENTS_FILE_PATH
```

### Run the server
```haml
node server.js
```


## Client instructions
Client is cli application that sends data to the server. 
The client gets two arguments:
* filePath - path to the file with user events data 
* serverUrl - root url of the server to send data to (e.g. http://localhost:3000)

### Before running the client

#### Prepare file with events data
Create file `events.jsonl` with  user events data, like this:
```json lines
{ "userId": "user1", "name": "add_revenue", "value": 98 }
{ "userId": "user1", "name": "subtract_revenue", "value": 72 }
{ "userId": "user2", "name": "add_revenue", "value": 70 }
{ "userId": "user1", "name": "add_revenue", "value": 1 }
{ "userId": "user2", "name": "subtract_revenue", "value": 12 }
```

### Run the client
```haml
node client.js --filePath="/home/test/events.jsonl" --serverUrl="http://localhost:8000"
```


## Data Processor instructions
Data Processor is cli application that processes data from the server.
The data processor gets one argument:
* filePath - path to the file with events data prepared by server (e.g /home/test/receivedEvents.jsonl)

### Set next environment variables
Database host
```
DB_SERVER
```
Database port
```
DB_PORT
```
Database name
```
DB_NAME
```
Database user
```
DB_USER
```
Database password
```
DB_PWD
```

### Run the data processor
```haml
node dataProcessor.js --filePath="/home/test/receivedEvents.jsonl"
```



