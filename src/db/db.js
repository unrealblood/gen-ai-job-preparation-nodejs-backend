import { MongoClient } from "mongodb";

export async function connectAndGetMongoDbClient() {
    try {
        return await MongoClient.connect(process.env.MONGODB_CONNECTION_URI);
    }
    catch(error) {
        console.log(error);
    }
}