import express from "express";
import { PublicationController } from "../controllers/PublicationController.js";
import { isEditor } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isEditor, PublicationController.index);
router.get("/create", isEditor, PublicationController.formCreate);
router.post("/create", isEditor, PublicationController.create);
router.get("/edit/:id", isEditor, PublicationController.formEdit);
router.put("/edit/:id", isEditor, PublicationController.update);
router.delete("/delete/:id", isEditor, PublicationController.delete);
router.put("/validation/:id", isEditor, PublicationController.validation);

export default router;