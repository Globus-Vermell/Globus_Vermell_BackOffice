import express from "express";
import { ProtectionController } from "../controllers/ProtectionController.js";
import { isEditor } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isEditor, ProtectionController.index);
router.get("/create", isEditor, ProtectionController.formCreate);
router.post("/create", isEditor, ProtectionController.create);
router.get("/edit/:id", isEditor, ProtectionController.formEdit);
router.put("/edit/:id", isEditor, ProtectionController.update);
router.delete("/delete/:id", isEditor, ProtectionController.delete);

export default router;