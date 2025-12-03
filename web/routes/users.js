import express from "express";
import { UserController } from "../controllers/UserController.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isAdmin, UserController.index);
router.get("/create", isAdmin, UserController.formCreate);
router.post("/create", isAdmin, UserController.create);
router.get("/edit/:id", isAdmin, UserController.formEdit);
router.put("/edit/:id", isAdmin, UserController.update);
router.delete("/delete/:id", isAdmin, UserController.delete);

export default router;