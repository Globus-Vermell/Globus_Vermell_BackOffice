import express from "express";
import { PrizeController } from "../controllers/PrizeController.js";
import { isEditor } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isEditor, PrizeController.index);
router.get("/create", isEditor, PrizeController.formCreate);
router.post("/create", isEditor, PrizeController.create);
router.get("/edit/:id", isEditor, PrizeController.formEdit);
router.put("/edit/:id", isEditor, PrizeController.update);
router.delete("/delete/:id", isEditor, PrizeController.delete);

export default router;