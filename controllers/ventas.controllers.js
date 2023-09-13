import db from "../config.js";
const ventas = db.collection('ventas');

export const getAll = async (req, res) => {
    try {
        const data = await ventas.find().toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const prescription2023 = async (req, res) => {
    try {
        const myDate = new Date("2023-01-01");
        const data = await ventas.find({fechaVenta : {$gte : myDate}}).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const findMedicineInSales = async (req, res) => {
    try {
        const {medicine} = req.params;
        const regex = new RegExp(medicine, 'i');
        const data = await ventas.find({"medicamentosVendidos.nombreMedicamento" : regex}).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}