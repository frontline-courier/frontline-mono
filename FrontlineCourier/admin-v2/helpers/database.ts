import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';
import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET', 'HEAD'],
})

const host = process.env.MONGO_DB_HOST;
const user = process.env.MONGO_DB_USER;
const pwd = process.env.MONGO_DB_PWD;
const uri = `mongodb+srv://${user}:${pwd}@${host}/frontline?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any);

async function database(req: any, res: any, next: any) {
    await client.connect();
    req.dbClient = client;
    req.db = client.db('frontline-booking');
    return next();
}

const middleware = nextConnect();

middleware.use(database);
middleware.use(cors);

export default middleware;
