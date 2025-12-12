import express from "express";
import { ArchitectController } from "../controllers/ArchitectController.js";
import { isEditor } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isEditor, ArchitectController.index);

router.get("/create", isEditor, ArchitectController.formCreate);
router.post("/create", isEditor, ArchitectController.create);

router.get("/edit/:id", isEditor, ArchitectController.formEdit);
router.put("/edit/:id", isEditor, ArchitectController.update);

router.delete("/delete/:id", isEditor, ArchitectController.delete);

export default router;