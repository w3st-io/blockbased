## Setup
Manually clone the repo and then run `npm install` in both the server and the client.

## .env should look like this:
##### [URL + PORT]
* BASE_URL = < (PRODUCTION ONLY) Url of Site >
* PORT = < Chosen port here >

##### [MONGODB]
* MONGO_URI = < Mongo uri goes here >

##### [EMAIL]
* EMAIL_PASSWORD = < Email password >
* EMAIL = < Email to send verification >
* MAILER_URL = < Url for email >

##### [SECRET]
* SECRET_KEY = < Your secret goes here >

## Note to Self..
##### When developing this appliction:
Anytime you are creating code that will modify the database think from the server side first. A good application is lite and most of the work should be done by the server.
#####
* "executed: false" --> Unexpected Error
* "status: false" --> Expected Error
##### 
##### Routes check params if they are ascii ( ex. validator.isAscii(param) )
##### Collection functions check params if they are specific type ( Ex. validator.isEmail(param) )


# %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
# %%% TODO LIST FOR DEPLOYMENT %%%
# %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#
* Set up base URL in ENV
* Set up secret in ENV
* Disable creating an admin account
* MongoDB password change
* Prepare mongoDB for more data
* Uncomment Expiration on tokens
* Stop user from deleting a comment
* Save unedited version of comment as well.
* Increase comment count on pages
* Increase Post Counts on Page
* Set encryption key for secrey key in env
