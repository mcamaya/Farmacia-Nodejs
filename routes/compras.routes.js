import { Router } from "express";
const router = Router();
import * as controller from "../controllers/compras.controllers.js";

router.get('/', controller.getAll);
router.get('/super_provider', controller.proveedorMasMedicamentos);

export default router;