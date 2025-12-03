import express from "express";
import multer from "multer";
import { TypologyController } from "../controllers/TypologyController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get("/", TypologyController.index);
router.get("/create", TypologyController.formCreate);
router.post("/create", TypologyController.create);
router.post("/create/upload", upload.single('image'), TypologyController.upload);

router.get("/edit/:id", TypologyController.formEdit);
router.put("/edit/:id", TypologyController.update);
router.post("/edit/upload", upload.single('image'), TypologyController.upload);

router.delete("/delete/:id", TypologyController.delete);

export default router;