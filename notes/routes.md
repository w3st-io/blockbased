## %%%%%%%%%%%%%%
## %%% ROUTES %%%
## %%%%%%%%%%%%%%

##### ////////// [ROUTES] /////////
##### // [ADMINS] //
##### /api/admin/login
##### /api/admin/register
#####
##### 
##### // [COMMENTS] //
##### /api/comments/create
##### /api/comments/read-all-all/:limit/:page
##### /api/comments/read-all/:cat_id/:limit/:page
##### /api/comments/read/:comment_id
##### /api/comments/update/:comment_id
##### /api/comments/delete/:comment_id
##### /api/comments/like/:comment_id
##### /api/comments/unlike/:comment_id
##### /api/comments/follow/:comment_id
##### /api/comments/report/:comment_id
##### /api/blocks/existance/:comment_id
##### /api/comments/count/:block_id
##### 
##### 
##### // [NOTIFICATIONS] //
##### /api/notifications/read-all/:limit/:page
##### 
##### 
##### // [POSTS] //
##### /api/posts/create
##### /api/posts/read-all/:cat_id/:limit/:page
##### /api/posts/read/:post_id
##### /api/posts/delete/:post_id
##### /api/posts/like/:post_id
##### /api/posts/unlike/:post_id
##### /api/posts/existance/:post_id
##### /api/posts/count/:cat_id
##### 
##### 
##### // [USERS] //
##### /api/users/read
##### /api/users/read/:user_id
##### /api/users/update
##### /api/users/login
##### /api/users/register
##### /api/users/verify