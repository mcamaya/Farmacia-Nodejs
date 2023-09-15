import db from "../config.js";
const compras = db.collection('compras');

export const getAll = async (req, res) => {
    const data = await compras.find().toArray();
    res.status(200).json(data);
}

export const gananciaProveedores = async (req, res) => {
    try {
        const date2022 = new Date("December 31, 2022");
        const date2024 = new Date("January 01, 2024");
        const data = await compras.aggregate([
            {
                $match:{
                    fechaVenta: {$gt: date2022},
                    fechaVenta: {$lt: date2024}
                }
            }
        ]).toArray();
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}


export const proveedorMasMedicamentos = async (req, res) => {
    try {
        const date2022 = new Date("December 31, 2022");
        const date2024 = new Date("January 01, 2024");
        const data = await compras.aggregate([
            {
                $match: {
                    fechaCompra: {$gt: date2022},
                    fechaCompra: {$lt: date2024}
                }
            },
            {$unwind: "$medicamentosComprados"},
            {
              $group: {
                _id: "$proveedor.nombre",
                totalCompras: {$sum:"$medicamentosComprados.cantidadComprada"} 
              }
            },
            {
                $sort: {
                    totalCompras: -1
                }
            }
          ]).limit(1).toArray();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}