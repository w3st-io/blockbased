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


### Routes

/////// [DATA] //////
// [BLOCKS] //
/api/blocks/create
/api/blocks/read-all/:cat_id/:amount/:skip
/api/blocks/read/:_id
/api/blocks/delete/:_id

/api/blocks/like/:_id
/api/blocks/unlike/:_id

/api/blocks/existance/:_id

/api/blocks/count/:cat_id


// [COMMENTS] //
/api/comments/create
/api/comments/read-all-all/:amount/:skip
/api/comments/read-all/:cat_id/:amount/:skip
/api/comments/read/:_id
/api/comments/update/:_id
/api/comments/delete/:_id

/api/comments/like/:_id
/api/comments/unlike/:_id

/api/comments/follow/:_id

/api/comments/report/:_id

/api/blocks/existance/:_id

/api/comments/count/:block_id


// [NOTIFICATIONS] //
/api/notifications/read-all/:amount/:skip


////// [USERS + ADMINS] //////
// [ADMINS] //
/api/admin/login
/api/admin/register