import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js";
// initiated same as app in express

const router = Router()

router.route("/register").post(registerUser)

export default router;