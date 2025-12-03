import express from "express";
import { PublicationController } from "../controllers/PublicationController.js";

const router = express.Router();

router.get("/", PublicationController.index);
router.get("/create", PublicationController.formCreate);
router.post("/create", PublicationController.create);
router.get("/edit/:id", PublicationController.formEdit);
router.put("/edit/:id", PublicationController.update);
router.delete("/delete/:id", PublicationController.delete);
router.put("/validation/:id", PublicationController.validation);

export default router;