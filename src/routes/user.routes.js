import {Router} from "express"
import { registerUser, loginUser, logoutUser, refreshAccessToken, updateAvatar, updateCoverImage, getCurrentUser, updateAccountDetails, changeCurrentPassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// initiated same as app in express

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)
router.route("/refresh-login").post(refreshAccessToken)

// secured routes(auth required)


router.route("/updateAvtar").post(
    verifyJWT, 
    upload.single("avatar"),
    updateAvatar
)

router.route("/updateCoverImage").post(
    verifyJWT, 
    upload.single("coverImage"),
    updateCoverImage
)

router.route("/get-current-user").post(verifyJWT, getCurrentUser)

router.route("/update-account-details").post(verifyJWT, updateAccountDetails)

router.route("change-password").post(verifyJWT, changeCurrentPassword)

router.route("/logout").post(verifyJWT,logoutUser)


// .post(middleware1, middleware2,....., function to be executed)

export default router;