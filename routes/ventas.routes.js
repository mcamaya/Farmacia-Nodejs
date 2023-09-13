import { Router } from "express";
const router = Router();
import * as controller from "../controllers/ventas.controllers.js";

router.get('/', controller.getAll);
router.get('/prescription_2023', controller.prescription2023);
router.get('/medicines_in_sales/:medicine', controller.findMedicineInSales);

export default router;