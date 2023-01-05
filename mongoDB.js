const dotenv = require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const Int32 = require("mongodb").Int32;
const NumberInt = require("mongodb").NumberInt;
const Double = require("mongodb").Double;

const __constString = `mongodb+srv://${process.env.mongodbSVC_User}:${process.env.mongodbSVC_Pwd}${process.env.mongoDB_Url}`;
const client = new MongoClient(__constString);

async function readFromDB(dataBase, table_collection, query) {
  try {
    // Logger på databasen
    await client.connect();
    // Her velger man hvilken db man skal koble seg på
    const db = client.db(dataBase);
    // Her velger man hviket table skal brukes
    const dbtTable = db.collection(table_collection);
    if (query == null) {
      // her henter man alt som er i table
      const cursor = dbtTable.find();
      await cursor.forEach(console.log);
    } else {
      // Henter alt i table som har {hasRings: true}
      const cursor = dbtTable.find(query);
      await cursor.forEach(console.log);
      // Henter alt i table som har {hasRings: true} og {mainAtomsphere: "Ar"}
      // // const cursor = coll.find({hasRings: false, mainAtomsphere: "Ar"});
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// // operator query
// readFromDB("sample_guides", "planets", { "surfaceTemperatureC.mean": { $lt: 15 } }).catch(console.dir);

// // om man ikke legger til en opreator i query så tolker den det som en AND
// readFromDB("sample_guides", "planets", {"surfaceTemperatureC.mean": { $lt: 15 },"surfaceTemperatureC.min": { $gt: -100 },}).catch(console.dir);

// // Implicit AND query
// readFromDB("sample_guides", "planets", {$and: [{ orderFromSun: { $gt: 2 } }, { orderFromSun: { $lt: 5 } }],}).catch(console.dir);

// // Or query
// readFromDB("sample_guides", "planets", {$or: [{ orderFromSun: { $gt: 7 } }, { orderFromSun: { $lt: 2 } }],}).catch(console.dir);

// // vanlig query
// readFromDB("sample_guides", "planets", {hasRings: true}).catch(console.dir);

async function writeToDB(dataBase, table_collection, query) {
  try {
    // Logger på databasen
    await client.connect();
    // Her velger man hvilken db man skal koble seg på
    const db = client.db(dataBase);
    // Her velger man hviket table skal brukes
    const dbtTable = db.collection(table_collection);

    // Skriver til db
    const result = await dbtTable.insertOne(query);
    console.log(result);
  } catch (e) {
    console.log(e);
    // e.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied[0]
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// insert code goes here

const date = new Date();
const docs = {
  UserName: "Alice",
  pwd: "2019",
  mail: "History",
  ActiveStatus: true,
  AccountCreated: date,
  RoomId: "Double(qweqweqwe.0)",
};

// writeToDB(process.env.mongoDB_Client_dev, "testCol", docs);
// readFromDB(process.env.mongoDB_Client_dev, "UsersTable").catch(console.dir);

async function updateTableInDB(
  dataBase,
  table_collection,
  filterQuery,
  updateDoc
) {
  try {
    // Logger på databasen
    await client.connect();
    // Her velger man hvilken db man skal koble seg på
    const db = client.db(dataBase);
    // Her velger man hviket table skal brukes
    const dbtTable = db.collection(table_collection);

    // table update
    const result = await dbtTable.updateOne(filterQuery, updateDoc);
    console.log("Number of documents updated: " + result.modifiedCount);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
const filter = { _id: ObjectId("63a84dcd80e4c9b7728c2402") };
const updateDoc = {
  $set: {
    name: "god jul",
  },
};
// Filter er en query for å spesifere søket lit
// updateDoc er et objekt med hva som oppdateres med
// updateTableInDB("sample_guides", "comets", filter, updateDoc);

// deletes the first document that matches the filter. Use a field that is part of a unique index such as _id for precise deletions.
async function DelTableInDB(dataBase, table_collection, filterQuery) {
  try {
    // Logger på databasen
    await client.connect();
    // Her velger man hvilken db man skal koble seg på
    const db = client.db(dataBase);
    // Her velger man hviket table skal brukes
    const dbtTable = db.collection(table_collection);
    await dbtTable.deleteOne(filterQuery);
    // console.log("Number of documents deleted: " + result.deletedCount);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const filter2 = { _id: ObjectId("63a857bb37c20b5dc0640bdd") };
// DelTableInDB("sample_guides","comets",filter2)

module.exports = { readFromDB };
