import { Router } from "express";
import db from "../config.js";
const router = Router();

const medicamentos = db.collection('proveedores');


router.get('/', async (req, res) => {
    const data = await medicamentos.find().toArray();
    res.status(200).json(data);
})

export default router;