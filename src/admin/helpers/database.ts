import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const host = process.env.MONGO_DB_HOST;
const user = process.env.MONGO_DB_USER;
const pwd = process.env.MONGO_DB_PWD;
const uri = `mongodb+srv://${user}:${pwd}@${host}/frontline?retryWrites=true&w=majority`;

async function database(req: any, res: any, next: any) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as any);

    await client.connect();
    req.dbClient = client;
    req.db = client.db('frontline-booking');
    return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
