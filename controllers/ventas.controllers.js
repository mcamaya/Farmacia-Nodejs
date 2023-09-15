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
        const date2022 = new Date("December 31, 2022");
        const date2024 = new Date("January 01, 2024");

        const data = await ventas.aggregate([
            {$match: {
                fechaVenta: {$gt: date2022}, // Me busque elementos que coincidan con la fecha
                fechaVenta: {$lt: date2024},
                "medicamentosVendidos.nombreMedicamento": "Paracetamol"
            }}
        ]).toArray();

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

        const [ result, count ] = await Promise.all([
            ventas.find({fechaVenta: {$gt: date}}).toArray(),
            ventas.countDocuments({fechaVenta: {$gt: date}})
        ]);
        
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

        const [ allQuantities , promediosIndividual ] = await Promise.all([
            ventas.aggregate([
                { $unwind: "$medicamentosVendidos" },
                {$project: 
                    {_id: "$medicamentosVendidos.nombreMedicamento",
                    avgQuantity : {  $avg : "$medicamentosVendidos.cantidadVendida" }}
                }
            ]).toArray(),
            ventas.aggregate([
                { $unwind: "$medicamentosVendidos" },
                {$group: 
                    {_id: "$medicamentosVendidos.nombreMedicamento",
                    avgQuantity : {  $avg : "$medicamentosVendidos.cantidadVendida" }}
                },
                {$sort: {avgQuantity: -1}}
            ]).toArray()
        ]);
        let contador = 0;
        allQuantities.forEach((e) => contador += e.avgQuantity);
        const promedioTotal = (contador / allQuantities.length);
        res.status(200).json({promedioMedicamentosXVenta: promedioTotal, promediosIndividual}); 
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const pacienteMasDinero = async (req, res) => {
    try {
        const dateInicio = new Date("2023-01-01");
        const dateFinal = new Date("2024-01-01");

        const data = await ventas.aggregate([
            {
                $match: {
                    fechaVenta: {
                        $gte: dateInicio,
                        $lt: dateFinal
                    }
                }
            },
            {$unwind: "$medicamentosVendidos"},
            {
                $group: {
                    _id: "$paciente.nombre",
                    totalGasto: {$sum: {$multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"]}}
                }
            },
            {
                $sort: {totalGasto:-1}
            }
        ]).limit(1).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}

export const salesPerMonth = async (req, res) => {
    try {
        const [Enero ,Febrero , Marzo, Abril , Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre] = await Promise.all([
            //enero
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-01-01"), 
                            $lt: new Date("2023-02-01")
                        }
                    }
                }
            ]).toArray(),

            //febrero
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-02-01"), 
                            $lt: new Date("2023-03-01")
                        }
                    }
                }
            ]).toArray(),

            //marzo
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-03-01"), 
                            $lt: new Date("2023-04-01")
                        }
                    }
                }
            ]).toArray(),

            //abril
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-04-01"), 
                            $lt: new Date("2023-05-01")
                        }
                    }
                }
            ]).toArray(),

            //mayo
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-05-01"), 
                            $lt: new Date("2023-06-01")
                        }
                    }
                }
            ]).toArray(),

            //junio
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-06-01"), 
                            $lt: new Date("2023-07-01")
                        }
                    }
                }
            ]).toArray(),

            //julio
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-07-01"), 
                            $lt: new Date("2023-08-01")
                        }
                    }
                }
            ]).toArray(),

            //agosto
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-08-01"), 
                            $lt: new Date("2023-09-01")
                        }
                    }
                }
            ]).toArray(),

            //septiembre
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-9-01"), 
                            $lt: new Date("2023-10-01")
                        }
                    }
                }
            ]).toArray(),

            //octubre
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-10-01"), 
                            $lt: new Date("2023-11-01")
                        }
                    }
                }
            ]).toArray(),

            //noviembre
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-11-01"), 
                            $lt: new Date("2023-12-01")
                        }
                    }
                }
            ]).toArray(),

            //diciembre
            ventas.aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-12-01"), 
                            $lt: new Date("2024-01-01")
                        }
                    }
                }
            ]).toArray(),
        ]);
        res.json({Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre});
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}