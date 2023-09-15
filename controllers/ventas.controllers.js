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

export const totalVentas = async (req, res) => {
    try {
        const data = await ventas.aggregate([
            {$unwind: "$medicamentosVendidos"}, // Descompone el array medicamentosVendidos 
            {$project: 
                {
                    _id: 0,
                    totalVentaMedicamento: { $multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"] }
                }
            }, // Crea un nuevo campo y multiplica precio x cantidad
            {$group: 
                {
                    _id: 0,
                    totalRecaudado: { $sum: "$totalVentaMedicamento" } // agrupa todos y suma
                }
            }
        ]).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const compraronParacetamol = async (req, res) => {
    try {
        const data = await ventas.find({"medicamentosVendidos.nombreMedicamento": "Paracetamol"}).toArray();
        const pacientes = data.map(e => e.paciente)
        res.status(200).json(pacientes);
    } catch (err) {
        
    }
}