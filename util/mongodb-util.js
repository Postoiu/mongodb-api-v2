const { MongoClient } = require('mongodb');

let mongoClient;

async function connectToDatabase(uri) {
    try {
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        console.log('Connected to MongoDB!');
    } catch(err) {
        console.error('Connection to MongoDB failed!');
        throw err;
    }
}

function closeConnection() {
    mongoClient.close();
}

function getClient() {
    return mongoClient;
}

function getDb(dbName) {
    return mongoClient.db(dbName);
}

async function insertToDatabase(documents, collection) {
    if(documents.length > 1) {
        await collection.insertMany(documents);
        return;
    }

    await collection.insertOne(documents[0]);
}

async function findDocuments() {}

module.exports = {
    connectToDatabase,
    closeConnection,
    getClient,
    getDb,
    insertToDatabase,
    findDocuments
}