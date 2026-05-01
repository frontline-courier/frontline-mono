import type { NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';
import type { ApiRequestWithDb } from './api';

const host = process.env.MONGO_DB_HOST;
const user = process.env.MONGO_DB_USER;
const pwd = process.env.MONGO_DB_PWD;
const uri = `mongodb+srv://${user}:${pwd}@${host}/frontline?retryWrites=true&w=majority`;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function getClient() {
    if (client) {
        return client;
    }

    if (!clientPromise) {
        const nextClient = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as any);

        clientPromise = nextClient.connect().then((connectedClient) => {
            client = connectedClient;
            return connectedClient;
        }).catch((error) => {
            clientPromise = null;
            throw error;
        });
    }

    return clientPromise;
}

async function database(req: ApiRequestWithDb, res: NextApiResponse, next: () => void) {
    const connectedClient = await getClient();
    req.db = connectedClient.db('frontline-booking');
    return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
