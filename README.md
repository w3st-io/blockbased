## Setup

Manually clone the repo and then run `npm install` in both the server and the client.


## .env should look like this:

MONGO_URI = < Mongo uri goes here (no quotes) >
DB = < DB name here >
PORT = < Chosen Port Here >
SECRET_KEY = < Your secret goes here >


### Note to myself..

when developing this appliction..
anytime you are creating code that will modify the database
think from the servers perspective first. sure the cat page
contains blocks but read-all blocks should not fall under cat services.
