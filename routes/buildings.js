import express from "express";
import multer from "multer";
import { BuildingController } from "../controllers/BuildingController.js";
import { isEditor } from "../middlewares/auth.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", isEditor, BuildingController.index);
router.get("/create", isEditor, BuildingController.formCreate);
router.get("/edit/:id", isEditor, BuildingController.formEdit);

router.post("/create", isEditor, BuildingController.create);
router.put("/edit/:id", isEditor, BuildingController.update);
router.delete("/delete/:id", isEditor, BuildingController.delete);

router.put("/validation/:id", isEditor, BuildingController.validate);
router.get("/typologies/filter", isEditor, BuildingController.filterTypologies);
router.post("/upload", upload.array('pictures', 10), isEditor, BuildingController.upload);

export default router;