import express from "express";
import { ArchitectController } from "../controllers/ArchitectController.js";

const router = express.Router();

router.get("/", ArchitectController.index);

router.get("/create", ArchitectController.formCreate);
router.post("/create", ArchitectController.create);

router.get("/edit/:id", ArchitectController.formEdit);
router.put("/edit/:id", ArchitectController.update);

router.delete("/delete/:id", ArchitectController.delete);

export default router;