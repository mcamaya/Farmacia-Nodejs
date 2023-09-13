import { Router } from "express";

//importando todas las rutas
import medicamentosRouter from "./medicamentos.routes.js";
import pacientesRouter from "./pacientes.routes.js";
import ventasRouter from "./ventas.routes.js";
import comprasRouter from "./compras.routes.js";
import empleadosRouter from "./empĺeados.routes.js";
import proveedoresRouter from "./proveedores.routes.js";

const router = Router();

// Routers con sus respectivos endpoints
router.use('/medicamentos', medicamentosRouter);
router.use('/pacientes', pacientesRouter);
router.use('/empleados', empleadosRouter);
router.use('/ventas', ventasRouter);
router.use('/compras', comprasRouter);
router.use('/proveedores', proveedoresRouter);

export default router;