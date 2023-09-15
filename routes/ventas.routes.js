import { Router } from "express";
const router = Router();
import * as controller from "../controllers/ventas.controllers.js";

router.get('/', controller.getAll);
router.get('/prescription_2023', controller.prescription2023);
router.get('/medicines_in_sales/:medicine', controller.findMedicineInSales);
router.get('/total_sales', controller.totalVentas);
router.get('/bought_paracetamol', controller.compraronParacetamol);
router.get('/sales_2023', controller.sales2023);
router.get('/less_sold_2023', controller.lessSold2023);
router.get('/average_sales', controller.promedioVentas);
router.get('/spent_most', controller.pacienteMasDinero);
router.get('/sales_per_month', controller.salesPerMonth);

export default router;