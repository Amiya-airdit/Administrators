const cds = require("@sap/cds");
const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = "mongodb://Amiya:Amiya1999@74.225.222.62:27017/";

// MongoDB Client setup
let client;
let mongoCollection;

async function connectToMongoDB() {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("Pratham"); // Specify your database name
    mongoCollection = database.collection("Users"); // Specify your collection name
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

module.exports = cds.service.impl(async function () {
  await connectToMongoDB();

  // Creating account here
  this.before("CREATE", "administrators", async (req) => {
    console.log("Before creating an administrator:", req.data);
  });

  this.on("CREATE", "administrators", async (req) => {
    try {
      // Format the creation date and time
      const now = new Date();
      const formattedDate =
        now.getDate().toString().padStart(2, "0") +
        "-" +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        now.getFullYear().toString() +
        "," +
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      // Create the administrator object with provided data and generated fields
      const administratorData = {
        ...req.data,

        createdDateTime: formattedDate,
      };

      // Insert the document into MongoDB
      const result = await mongoCollection.insertOne(administratorData);
      console.log(
        `Document inserted in MongoDB with _id: ${result.insertedId}`
      );

      // Return a 201 status code along with the inserted document
      return administratorData;
    } catch (err) {
      console.error("Error inserting document into MongoDB", err);
      req.error(500, "Unable to insert data");
    }
  });

  this.on("READ", "administrators", async (req) => {
    try {
      let query = {
        type: { $in: [1, 7, 10] },
      }; // For search operation and for update as well of particular/ Unique data

      // Extract conditions from the req.query.SELECT.where clause if it exists
      if (req.query.SELECT.where) {
        const whereClause = req.query.SELECT.where;
        for (let i = 0; i < whereClause.length; i += 2) {
          // Check for field and value pairs
          if (whereClause[i].ref && whereClause[i + 1] === "=") {
            const field = whereClause[i].ref[0];
            const value = whereClause[i + 2].val;
            query[field] = value;
            i++;
          }
        }
      }

      console.log("Query based on conditions:", query);

      // Fetch documents based on constructed query
      const documents = await mongoCollection.find(query).toArray();
      console.log("Fetched documents:", documents);

      // Calculate the total count of records matching the query
      const totalCount = await mongoCollection.countDocuments(query);
      console.log(totalCount, "---------------count");

      const result = documents.map((doc) => ({
        ...doc,
        status: "Active",
      }));

      result["$count"] = totalCount; // Include $count for CAP consumption
      return result;
    } catch (err) {
      console.error("Error reading documents from MongoDB", err);
      req.error(500, "Unable to fetch data");
      return [];
    }
  });

  // Update the account record here
  // http://localhost:4004/odata/v4/account/deptviews(id=3a56a681-f102-480f-8696-b40ba5431400)(postman id format)
  this.on("PUT", "administrators", async (req) => {
    const username = req.params[0].username;
    console.log(username);
    const { name, lastname, phone } = req.data;
    try {
      const result = await mongoCollection.updateOne(
        { username: username },
        { $set: { name, lastname, phone } }
      );

      return result;
    } catch (err) {
      console.error("Error updating document in MongoDB", err);
      req.error(500, "Unable to update document");
    }
  });

  // Delete account record here
  this.on("DELETE", "administrators", async (req) => {
    try {
      const username = req.params[0].username; // Extract the ID from the request URL parameters
      console.log(username);
      if (!username) {
        throw new Error("username field is missing or undefined");
      }
      const result = await mongoCollection.deleteOne({
        username: username,
      });

      if (result.deletedCount === 1) {
        console.log(
          `Document with username ${username} deleted successfully from MongoDB`
        );
        return {
          message: `Document with ID ${username} deleted successfully`,
        };
      } else {
        console.log(`No document found with ID ${idToDelete}`);
      }
    } catch (error) {
      console.error("Error deleting document from MongoDB", error);
    }
  });

  this.on("disconnect", async () => {
    if (client) {
      await client.close();
      console.log("Disconnected from MongoDB.");
    }
  });
});
