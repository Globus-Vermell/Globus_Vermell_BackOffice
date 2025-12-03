import express from "express";
import { ReformController } from "../controllers/ReformController.js";

const router = express.Router();

router.get("/", ReformController.index);
router.get("/create", ReformController.formCreate);
router.get("/create/architects", ReformController.getArchitects);
router.post("/create", ReformController.create);
router.get("/edit/:id", ReformController.formEdit);
router.put("/edit/:id", ReformController.update);
router.delete("/delete/:id", ReformController.delete);

export default router;