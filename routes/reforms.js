import express from "express";
import { ReformController } from "../controllers/ReformController.js";
import { isEditor } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isEditor, ReformController.index);
router.get("/create", isEditor, ReformController.formCreate);
router.post("/create", isEditor, ReformController.create);
router.get("/edit/:id", isEditor, ReformController.formEdit);
router.put("/edit/:id", isEditor, ReformController.update);
router.delete("/delete/:id", isEditor, ReformController.delete);

export default router;