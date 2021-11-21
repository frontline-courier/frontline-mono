import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const uri = "mongodb+srv://frontlineapp:SNveY2tiKp3NqfJ@frontline.tsxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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

export default middleware;
