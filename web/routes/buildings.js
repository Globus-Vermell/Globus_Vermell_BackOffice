import express from "express";
import multer from "multer";
import { BuildingController } from "../controllers/BuildingController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", BuildingController.index);
router.get("/create", BuildingController.formCreate);
router.get("/edit/:id", BuildingController.formEdit);

router.post("/create", BuildingController.create);
router.put("/edit/:id", BuildingController.update);
router.delete("/delete/:id", BuildingController.delete);

router.put("/validation/:id", BuildingController.validate);
router.get("/typologies/filter", BuildingController.filterTypologies);
router.post("/upload", upload.array('pictures', 10), BuildingController.upload);

export default router;