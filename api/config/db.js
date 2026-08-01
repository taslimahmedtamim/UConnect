const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.log('[Database] MONGODB_URI not provided in environment variables.');
        console.log('[Database] Running in Local Memory Data Store mode.');
        return false;
    }

    try {
        const db = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log(`[Database] MongoDB Atlas Connected successfully: ${db.connection.host}`);
        return true;
    } catch (error) {
        console.error(`[Database] Connection Error: ${error.message}`);
        console.log('[Database] Falling back to Memory Data Store mode.');
        return false;
    }
};

module.exports = connectDB;
