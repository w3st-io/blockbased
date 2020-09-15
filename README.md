## Setup

Manually clone the repo and then run `npm install` in both the server and the client.


## .env should look like this:

#### DB = < DB name here >
#### EMAIL_PASSWORD = < Email password >
#### EMAIL = < Email to send verification >
#### MAILER_URL = < Url for email >
#### MONGO_URI = < Mongo uri goes here >
#### PORT = < Chosen port here >
#### SECRET_KEY = < Your secret goes here >
#### BASE_URL = < Url of Site >


## Note to myself..

##### when developing this appliction..
##### anytime you are creating code that will modify the database
##### think from the servers perspective first. sure the cat page
##### contains blocks but read-all blocks should not fall under cat services.
#####
##### "executed: false" --> Unexpected Error
##### "status: false" --> Expected Error
##### 
##### Routes check params if they are ascii
##### ( ex. validator.isAscii(param) )
##### 
##### Collection functions check params if they are specific type
##### ( Ex. validator.isEmail(param) )