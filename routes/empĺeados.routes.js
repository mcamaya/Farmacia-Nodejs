import { Router } from "express";
import * as controller from "../controllers/empleados.controllers.js";

const router = Router();

router.get('/', controller.getAll);
router.get('/employees_sales', controller.salesEmployees);
router.get('/more_than_5_sales', controller.MoreThan5Sales);
router.get('/is_not_selling', controller.whoNoSells);

export default router;