import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
dotenv.config();

//Creamos la conexión y seteamos las opciones de API estable
const client = new MongoClient(process.env.MONGO_URI,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect();
const db = client.db('farmaciaCampus');

export default db;