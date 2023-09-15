import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
dotenv.config();

//Creamos la conexión y seteamos las opciones de API estable
const client = new MongoClient(process.env.MONGO_URI);

client.connect();
const db = client.db('farmaciaCampus');

export default db;