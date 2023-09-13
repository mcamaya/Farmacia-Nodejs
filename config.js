import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";

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