-for staging empty folders in git we will use .gitkeep file, this file will not conating anything but helps the staging empty folder

-empty folders are always untracked

-nodemon is dev dependency which means it is not required at the time production

-whereas dependencies are the one which are used during the production too

-added prettier so that there is no conflict between the team member's different code while combining

-the code for the gitignore file can be generated throgh gitignore generators

-always remember database connectivity can give errors thus always wrap in try catch for catching errors

-another important thing is that always use database is situated in another continent and thus always use async and await.

-remember the nodemon is the one which can restart the server automatically on changes, but important thing is that if there are changes in the .env file then the nodemon needs to be restarted

-while confuguring the dotenv remember few things: 
    1. always confugure in the starting of the entry point file.
    2. for current versions only only the require syntax is allowed but we can still use import syntax by changing the dev script to --experimental.

-Always try to resolve error while db connection very gracefully as it would be helpful in debuging.