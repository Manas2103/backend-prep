# Notes for Backend learning 
### GitHub Concepts:
- for staging empty folders in git we will use .gitkeep file, this file will not conating anything but helps the staging empty folder

- empty folders are always untracked

- the code for the gitignore file can be generated throgh gitignore generators

### Dev-Dependencies v/s Dependencies:
- nodemon is dev dependency which means it is not required at the time production

- whereas dependencies are the one which are used during the production too


### Prettier Config:
- added prettier so that there is no conflict between the team member's different code while combining

### Important DB code guides:
- always remember database connectivity can give errors thus always wrap in try catch for catching errors

- another important thing is that always use database is situated in another continent and thus always use async and await.

### Nodemon:
- remember the nodemon is the one which can restart the server automatically on changes, but important thing is that if there are changes in the .env file then the nodemon needs to be restarted

### while confuguring the dotenv remember few things:
    
- always confugure in the starting of the entry point file.
- for current versions only only the require syntax is allowed but we can still use import syntax by changing the dev script to experimental.

### Resolve Errors :
- Always try to resolve error while db connection very gracefully as it would be helpful in debuging.


- Async function always returns a promise which can be resolved through .then and .catch functions.

- In this promise we can listen to our app created in the app.js file.

### Middlewares:
- used for checking purpose b/w the request and response of the backend, it can be like if user is logged in or not,if user is not admin if request is for admin.
- the check is executed in the sequence in whch we write the code.  
#### CORS
- mostly middlewares sre used with the syntax app.use(<middleware>), for eg. app.use(cors()) for cors(cross origin).

- The  Cross-Origin Resource Sharing (CORS) have some more things like setting the origin url, if mentioned "*" means all the urls are whitelisted for accessing the backend. Take this variable from the env file.

###### CORS, it requires the app to be declared first then use the app.use syntax.

###### Use of Next in the code:
- next is type of FLAG that conveys the information of the checking being is completed or not by the previous middleware check, its of no use when it reaches to the response code.

### while handling the request:
- there are four things (error, response, response, next), out of which the next is defined above.

### Wraper over the database connectivity:
- This is created so that we do not have to create the connection everytime when we need the data base.
- For this we have two options:
    - either by the Promise.resolve and .reject, which is little complex.
    ```javascript
    const asyncHandler = (requestHandler) => {
        //it can directly return in the format of promise
        (req, res, next) => {
            Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
        }
    }
    ```
    - or by using  async/await with try/catch.

    ```javascript
    const asyncHandler = (fn) => async(req, res, next) => {
        try{
            //execute the function here
            await fn(req, res, next);
        }
        catch(error){
            res.status(error.code || 500).json({
                success : false,
                message : error.message
            })
        }
    }
    ```

- ***what it does is takes a function as a parameter inside the wraper or method we created and execute it where it is expected by wrapping it with the foundations of data base connectivity.***