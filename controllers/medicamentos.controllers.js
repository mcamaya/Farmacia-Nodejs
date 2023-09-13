import db from "../config.js";
const medicamentos = db.collection('medicamentos');

export const getAll = async (req, res) => {
    try {
        const data = await medicamentos.find().toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const stockLessThan50 = async (req, res) => {
    try {
        const data = await medicamentos.find({stock:{$lt: 50}}).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const providedBy = async (req, res) => {
    try {
        const {provider} = req.query;
        const regex = new RegExp(provider, 'i');
        const data = await medicamentos.find({"proveedor.nombre" : regex}).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const expiresBefore2024 = async (req, res) => {
    try {
        const myDate = new Date("2025-01-01").toISOString();
        const data = await medicamentos.find({fechaExpiracion : {$lt : myDate}}).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const allProviders = async (req, res) => {
    try {
        const provA = await medicamentos.countDocuments({"proveedor.nombre" : "ProveedorA"}).toArray();
        const provB = await medicamentos.countDocuments({"proveedor.nombre" : "ProveedorB"}).toArray();
        const provC = await medicamentos.countDocuments({"proveedor.nombre" : "ProveedorC"}).toArray();

        res.status(200).json({
            ProveedorA: {
                count: provA
            },
            ProveedorB: {
                count: provB
            },
            ProveedorC: {
                count: provC
            }
        });
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}
