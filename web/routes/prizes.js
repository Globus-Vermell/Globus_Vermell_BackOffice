import express from "express";
import { PrizeController } from "../controllers/PrizeController.js";

const router = express.Router();

router.get("/", PrizeController.index);
router.get("/create", PrizeController.formCreate);
router.post("/create", PrizeController.create);
router.get("/edit/:id", PrizeController.formEdit);
router.put("/edit/:id", PrizeController.update);
router.delete("/delete/:id", PrizeController.delete);

export default router;