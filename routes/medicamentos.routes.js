import { Router } from "express";
import db from "../config.js";
import * as controller from "../controllers/medicamentos.controllers.js";
const router = Router();

router.get('/', controller.getAll)
router.get('/stock_-50', controller.stockLessThan50);
router.get('/provided_by', controller.providedBy);
router.get('/all_providers', controller.allProviders);
router.get('/expires_2024', controller.expiresBefore2024);
router.get('/not_sold', controller.notSold);
router.get('/most_expensive', controller.mostExpensiveOne);

export default router;