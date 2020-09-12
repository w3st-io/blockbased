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

when developing this appliction..
anytime you are creating code that will modify the database
think from the servers perspective first. sure the cat page
contains blocks but read-all blocks should not fall under cat services.

"executed: false" --> Unexpected Error
"status: false" --> Expected Error

Routes check params if they are ascii
( ex. validator.isAscii(param) )

Collection functions check params if they are specific type
( Ex. validator.isEmail(param) )


## Routes
##### 
##### ////////// [ROUTES] /////////
##### // [ADMINS] //
##### /api/admin/login
##### /api/admin/register
#####
##### 
##### // [COMMENTS] //
##### /api/comments/create
##### /api/comments/read-all-all/:amount/:skip
##### /api/comments/read-all/:cat_id/:amount/:skip
##### /api/comments/read/:_id
##### /api/comments/update/:_id
##### /api/comments/delete/:_id
##### /api/comments/like/:_id
##### /api/comments/unlike/:_id
##### /api/comments/follow/:_id
##### /api/comments/report/:_id
##### /api/blocks/existance/:_id
##### /api/comments/count/:block_id
##### 
##### 
##### // [NOTIFICATIONS] //
##### /api/notifications/read-all/:amount/:skip
##### 
##### 
##### // [POSTS] //
##### /api/posts/create
##### /api/posts/read-all/:cat_id/:amount/:skip
##### /api/posts/read/:_id
##### /api/posts/delete/:_id
##### /api/posts/like/:_id
##### /api/posts/unlike/:_id
##### /api/posts/existance/:_id
##### /api/posts/count/:cat_id
##### 
##### 
##### // [USERS] //
##### /api/users/read
##### /api/users/read/:_id
##### /api/users/update
##### /api/users/login
##### /api/users/register
##### /api/users/verify