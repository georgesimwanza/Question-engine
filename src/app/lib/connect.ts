import mongoose from "mongoose";

const MongoDb_Url = "mongodb://localhost:27017/Engine";

if(!MongoDb_Url){
    throw new Error("wrong mongo db url");
}

let cached = (global as any).mongoose || {conn: null, promise: null};

async function connectToMongoDb(){
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        cached.promise = mongoose.connect(MongoDb_Url);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
export default connectToMongoDb;