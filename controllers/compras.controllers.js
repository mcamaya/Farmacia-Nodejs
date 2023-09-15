import db from "../config.js";
const compras = db.collection('compras');

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
            },
            {
                $project: {
                    
                }
            }
        ])
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}