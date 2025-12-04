import express from "express";
import multer from "multer";
import { TypologyController } from "../controllers/TypologyController.js";
import { isEditor } from "../middlewares/auth.js";
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get("/", isEditor, TypologyController.index);
router.get("/create", isEditor, TypologyController.formCreate);
router.post("/create", isEditor, TypologyController.create);
router.get("/edit/:id", isEditor, TypologyController.formEdit);
router.put("/edit/:id", isEditor, TypologyController.update);
router.delete("/delete/:id", isEditor, TypologyController.delete);
router.post("/upload", upload.single('image'), isEditor, TypologyController.upload);
export default router;