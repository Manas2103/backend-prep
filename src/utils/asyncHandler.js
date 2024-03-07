const asyncHandler = (requestHandler) => {
    //it can directly return in the format of promise
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}

//the method with the async and await with try and catch

//here we are using call back inside the call back as the parameter passed is a function inside the super function.


// const asyncHandler = (fn) => async(req, res, next) => {
//     try{
//         //execute the function here
//         await fn(req, res, next);
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }
// }
