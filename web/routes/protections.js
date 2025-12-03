import express from "express";
import { ProtectionController } from "../controllers/ProtectionController.js";

const router = express.Router();

router.get("/", ProtectionController.index);
router.get("/create", ProtectionController.formCreate);
router.post("/create", ProtectionController.create);
router.get("/edit/:id", ProtectionController.formEdit);
router.put("/edit/:id", ProtectionController.update);
router.delete("/delete/:id", ProtectionController.delete);

export default router;