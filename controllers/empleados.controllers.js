import db from "../config.js";
const medicamentos = db.collection('empleados');
const ventas = db.collection('ventas');
const empleados = db.collection('empleados');

export const getAll = async (req, res) => {
    const data = await medicamentos.find().toArray();
    res.status(200).json(data);
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

export const salesEmployees = async (req, res) => {
    try {
        const empleados = await ventas.distinct("empleado.nombre");
        const data = await Promise.all(empleados.map(async emp => {
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

export const whoNoSells = async (req, res) => {
    try {
        const allEmpleados = await empleados.distinct("nombre");
        const notSelling = [];
        const data = await Promise.all(allEmpleados.map(async emp => {
            let i = await ventas.find({"empleado.nombre": emp}).toArray();
            if (i == false){
                notSelling.push(emp);
            }
        }));
        
        res.status(200).json({noHanVendido:notSelling});
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log(err);
    }
}