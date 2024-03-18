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

### Handling Api Errors and responses:
- While handling errors from api requests, we can make a class which extends the Error class already provided and makes it streamlined process to handle erros. Thus making it easier to pass the required parameters like error messgage, successCode, etc.

- Same thing we can do to handle responses from API requests in a streamlined way. Note here there is no parent class.

- For more information read the apiError documentation of express JS. Also find out why 

```javascript
this.data = null
```
- in the apiError file.



### Model Schemas for user and videos

- ***index*** : Use of index in the schema definition is that, it can be used for searching based fields, although it is very costlier.


### Cloudinary:
- When the cloudinary saves it file, then it will provide us with the url and durartion.

### mongoose-Aggregate-Paginate-v2:
- This is the library which allows us to write aggregate queries. It uses the real power of mongoDB.

- This is injected as a plugin.

- Use this before exporting the schema. And this is custom plugin.

```javascript
videoSchema.plugin(mongooseAggregatePaginate)
```

### bcrypt and bcrptJS
- Almost same work in both.
- We are using core bcrypt.
- It helps us to resolve the problem of clear text passwords by hashing the passwords.

#### ***Both JWT and bcrypt are based on cryptography.***

### JWT:
- Jason Web Tokens,can be used for tokens.
- jwt.io
- Headers contains the algos and type, automatically injected.
- Payload, the data is injected in this field.
- Verification Signature, the secret code is the one which makes tokens unique and protect them.

### How does this encryption will work??
- For this we will take the help of the mongoose hooks as the encryption doesn't work directly.
- One of which is the pre hook, which is executed just before saving the data, like encryption of password
- Import both bcrypt and JWT.
- Its same as plugin.
- There are multiple events on which can use pre hook, in this case we are using save event.

- It takes two parameters i. event ii. call back, for call backs we will not use arrow function as in that we cannot use context of database like this.password, etc.(Its very important to know the context of DB).

- Since these encryption functions are compplex functions thus takes time, so write async ahead of the call back.

- Inside the callback we must have he access to next flag (middleware).

- Below is the code:

```javascript
userSchema.pre("save", async function(next){
    //checking if modified
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 8)
    next()
})
```
- The if condition is for checking if the database is modified or not, using this to avoid multiple generation of password encryption.
-bcrypt.hash is a method which hashes the password given and the number '8' is the number of rounds or salts. 

- Now we will write some methods so that when we call the User we can verify the password.

- Mongoose allows custom methods.

- Inside this method for checking the password. bcrypt library provides .compare to compare the user given password and the encrypted password(this.password).
-Code : 
```javascript
userSchema.methods.isPasswordCorrect = async function(password){
    //it returns true or false
    return await bcrypt.compare(password, this.password)
}
```

#### What does JWT actually do??
- JWT is a bearer token.

- It means, it is like a key, who have that key it will get the data.

- for this we have to make access_token_secret, access_token_expiry, refresh_token_secret, refresh_token_expiry variables in the environment variables file.

- Remember that refresh tokens ar saved in DB, but access tokens are not.

- Also the expiry for refresh tokens is longer than the access tokens as they are refresed frequently.

- We can use jwt.sign to generate tokens.
- No async is required:

- Access token :
```javascript
userSchema.methods.generateAccessToken() = function(){
    //sign creates access tokens.
    jwt.sign(
        //payload
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname
        },
        //Access toke secret, it is given directly
        process.env.ACCESS_TOKEN_SECRET,
        //expiry, given inside the object
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
```
- Refresh token :
```javascript
userSchema.methods.generateRefreshToken() = function(){
    //sign creates access tokens.
    jwt.sign(
        //payload, for refresh token, this much payload is not required
        {
            _id : this._id,
        },
        //Access toke secret, it is given directly
        process.env.REFRESH_TOKEN_SECRET,
        //expiry, given inside the object
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}
```

- The difference in both the tokens is that, the information required in refresh token is very less as it is refresed frequently.

- More will be covered later.

### File Upload:
- we will use two step process,
- (i) we will use multer to upload file on to the local server.
- (ii) then using cloudinary we will upload the file from local server to the cloudinary.

- Remember multer is necessary for file upload and it is a middleware.

- For this we will also require the fs(file system), inbuilt in nodejs.

- fs is used for reading, removing, sync or async, etc, it will provide us with the file path.

- for removing the file we will use the unlink of the fs. The file is not deleted.

- the file upload is complicated same as db connection thus while uploading we will use try catch. Also it will take time, so use async.

- For multer read the documentation with diskStorage part.

- The storage method in the multer provides us the file path.

- Handling will be done later.

## Starting of controller and router...

- We are going to register the user first.

- the async handler we created will wrap the register user method.

- the asyncHandler will be the super function inside which we will create the method of register user.

- the method includes passing of response status code "200" and response message as "OK".

- below is the code.

```javascript
const registerUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message : "ok"
    })
})
```
#### Routers:
- for every url the router will be different.
- In production, we will import different routers inside the app.js file not in index.js, it is kept for listening the app.

- To divide the modules inside a file we will write the router import statement at below side.

- Always remember that while declaring the imported router we will use app.use not app.get, thus middleware is compulsary for declaring an imported router. 

- the app.use() will take here two parameters.
- (i) the preffix path after localhost for eg. we are creating for user registration then it will be "/user". Since its an api making we can add "api/v1/users", its nothing but a good practice.

- (ii) It will take the imported router.

- Now this will work like this when "/user" chosed then userRouter(imported) will be activated and then it will call the register user controller according to the HTTP methods for handing over the control. Also here all the paths like "/register" and "/login" will be given over the prefix path set in the above 1st parameter.

### Logic builiding exercise:
- based on real world coding.

- break down the bigger problem into smaller problems.

- Take the problem of registration of an user.

#### Below are the steps or smaller problems for user registration.

- get user details from frontend(we will use postman)

- validate if fields are empty or not.

- check if user already exists.

- Check for avatars as it is compulsary.

- upload the files to cloudinary.

- Implement req. checks for upload to cloudinary through multer.

- create user object as entries to DB, in mongoDB entries are in the form of objects.

- remove password and refresh token fields from the response.

- check whether the user is created or not.

- return the response.

- Code part :

- if the data from user is coming from form then we can get that by req.body , where  req -> request.

- data from url are handled differenty.

- now destructure this req.body

- like {fullName, email, usrname, password} = req.body

- This data will from form fields taking data not for the files.

- Before handling the files, we use postman for testing the data of req.body

- for now in body section go to raw data and select json.

- Here provide the data in JSON form (key : value) pair

- Now for handling the files, we have created a middleware multer, for this to get implemented we will call this middleware just before executing the registerUser method in user router.

- upload is the name of imported middleware(multer---storage).

- It provide us multiple methods like taking single file, array of files(this will be multilple files from single field), fields(for taking files from multiple input).

we will use this upload.fields -> inside this we need to create array of object of files' name and maxcount for each field.

- Refer the code file for code.