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
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const sales2023 = async (req, res) => {
    try {
        const date = new Date("December 31, 2022");
        const result = await ventas.find({fechaVenta: {$gt: date}}).toArray();
        const count = await ventas.countDocuments({fechaVenta: {$gt: date}})
        res.status(200).json({count, result});
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const lessSold2023 = async (req, res) => {
    try {
        const date2022 = new Date("December 31, 2022");
        const date2024 = new Date("January 01, 2024");

        const data = await ventas.aggregate([
            {$match: {
                fechaVenta: {$gt: date2022}, // Me busque elementos que coincidan con la fecha
                fechaVenta: {$lt: date2024}
            }},
            {$unwind: "$medicamentosVendidos"}, // desestructure el array
            {$group: 
                {_id: "$medicamentosVendidos.nombreMedicamento", // agrupa los que coincidan con el mismo nombre y suma las veces que ha sido vendido
                totalVendido: { $sum: "$medicamentosVendidos.cantidadVendida"},
            }},
            {$sort: {
                totalVendido: 1, // Hacemos que el resultado menor se posicione como el primero
                _id: 1
            }},
            //{$limit: 1} // Podemos usar limit para hallar el elemento menos vendido cuando los valores no se repiten
        ]).toArray();

        res.status(200).json({msg: `Los primeros elementos son los que tienen menos ventas. Hay ${data.length} resultados`, data});
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const promedioVentas = async (req, res) => {
    try {
        const allQuantities = await ventas.aggregate([
            { $unwind: "$medicamentosVendidos" },
            {$project: 
                {_id: "$medicamentosVendidos.nombreMedicamento",
                avgQuantity : {  $avg : "$medicamentosVendidos.cantidadVendida" }}
            }
        ]).toArray();
        const promediosIndividual = await ventas.aggregate([
            { $unwind: "$medicamentosVendidos" },
            {$group: 
                {_id: "$medicamentosVendidos.nombreMedicamento",
                avgQuantity : {  $avg : "$medicamentosVendidos.cantidadVendida" }}
            },
            {$sort: {avgQuantity: -1}}
        ]).toArray();
        let contador = 0;
        allQuantities.forEach((e) => contador += e.avgQuantity);
        const promedioTotal = (contador / allQuantities.length);
        res.status(200).json({promedioMedicamentosXVenta: promedioTotal, promediosIndividual}); 
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}


export const salesEmployees = async (req, res) => {
    try {
        const empleados = await ventas.distinct("empleado.nombre");
        const data = await Promise.all (empleados.map(async emp => {
            let i = await ventas.aggregate([
                {$match: 
                    {"empleado.nombre": emp} // Consultas dinámicas. Por cada empleado va a hacer esta consulta
                }
            ]).toArray();

            let obj = {
                "empleado": emp,
                "cantidadVentas": i.length,
                "ventas": i
            }

            return obj
        }))

        console.log(empleados);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const MoreThan5Sales = async (req, res) => {
    try {
        const data = await ventas.aggregate([
            {
              $group: {
                _id: "$empleado.nombre",
                totalVentas: { $sum: 1 } //suma 1 por cada venta para contar el total
              }
            },
            {
              $match: {
                totalVentas: { $gt: 5 } //filtra empleados con más de 5 ventas
              }
            },
            {
              $project: {
                _id: 0,
                totalVentas: 1,
                empleado: "$_id"
              }
            }
          ]).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}