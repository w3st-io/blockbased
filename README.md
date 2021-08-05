# Blockbased.io

## ENV File Example
##### FUNCTIONALITY
* ADMIN_USER_FUNCTIONALITY = < true/false >
* PAYMENT_SYSTEM = < true/false >
* POST_FUNCTIONALITY = < true/false >
* COMMENT_FUNCTIONALITY = < true/false >

##### URL
* *BASE_URL = https://wwww.< (PRODUCTION ONLY) Url of Site >

##### PORT
* PORT = < Chosen port here >

##### MONGODB
* MONGO_URI = < Mongo uri goes here >

##### EMAIL
* EMAIL_PASSWORD = < Email password >
* EMAIL = < Email to send verification >
* MAILER_URL = < Url for email >

##### SECRET
* SECRET_KEY = < Your secret goes here >

##### IEX
* IEX_PUBLIC_KEY = < IEX Public Key >
* IEX_SB_PUBLIC_KEY = < IEX Sandbox Public Key >


## Note to Self..
Anytime you are creating code that will modify the database think from the server side first. A good application is lite and most of the work should be done by the server.


## Server Status System
```
* "executed: false" --> Unexpected Error
* "status: false" --> Expected Error
``` 

## When Designing Server
* Routes check params if they are ascii ( ex. validator.isAscii(param) )
* Collection functions check params if they are specific type ( Ex. validator.isEmail(param) )


## TODO List For Deployment
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
