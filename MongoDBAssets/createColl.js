const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { MongoClient } = require("mongodb");
const __constString = `mongodb+srv://${process.env.mongodbSVC_User}:${process.env.mongodbSVC_Pwd}${process.env.mongoDB_Url}`;

const client = new MongoClient(__constString);
const db = client.db(process.env.mongoDB_Client_dev);

async function creatCOL(collName) {
  try {
    await client.connect();
    db.createCollection(collName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          title: collName,
          required: [
            "UserName",
            "pwd",
            "mail",
            "ActiveStatus",
            "AccountCreated",
            "RoomId",
          ],
          properties: {
            UserName: {
              bsonType: "string",
              description: "'UserName' must be a string and is required",
            },
            pwd: {
              bsonType: "string",
              description: "'pwd' must be a string and is required",
            },
            mail: {
              bsonType: "string",
              description: "'mail' must be a string and is required",
            },
            ActiveStatus: {
              bsonType: "bool",
              description: "'ActiveStatus' must be a bool and is required",
            },
            AccountCreated: {
              bsonType: "date",
              description: "'AccountCreated' must be a date and is required",
            },
            RoomId: {
              bsonType: "string",
              description: "'RoomId' must be a string and is required",
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}
// creatCOL();
