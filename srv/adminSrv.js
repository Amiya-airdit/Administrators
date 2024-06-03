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
 
      // Parse and format the departments field
      // let departments = [];
      // if (req.data.departments) {
      //   // Assuming req.data.departments is a comma-separated string
      //   departments = req.data.departments
      //     .split(",")
      //     .map((dept) => ({ name: dept.trim() }));
      // }
 
      // Create the administrator object with provided data and generated fields
      // const administratorData = {
      //   ...req.data,
      //   createdDateTime: formattedDate,
      //   departments: departments,
      // };
 
      const { username, name, lastname, email, phone, adminType, departments } =
        req.data;
      console.log(departments);
      let administratorData = {
        name: name,
        username: username,
        lastname: lastname,
        createdDateTime: formattedDate,
        email: email,
        phone: phone,
        departments: [{ name: departments }],
        adminType: adminType,
      };
      const result = await mongoCollection.insertOne(administratorData);
 
      return administratorData;
    } catch (err) {
      console.error("Error inserting document into MongoDB", err);
      req.error(500, "Unable to insert data");
    }
  });
 
  this.on("READ", "administrators", async (req) => {
    try {
      let query = { type: { $in: [1, 7, 10] } }; // Initialize query with a default filter
 
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
 
      // Fetch users based on constructed query
      const users = await client
        .db("Pratham")
        .collection("Users")
        .find(query)
        .toArray();
      console.log("Fetched users:", users);
 
      for (const user of users) {
        if (user.departments && user.departments.length > 0) {
          const firstDepartmentname = user.departments[0].name;
          user.departments = firstDepartmentname;
        } else {
          user.departments = null; // Set to null if no departments exist
        }
      }
 
      // Log the results
      users.forEach((user) => {
        console.log(`User: ${user.username}`);
        console.log(`Department Name: ${user.departments}`);
      });
      // users["$count"] = users.length;
 
      // return users;
 
      const result = users.map((doc) => ({
        ...doc,
        status: "Active",
      }));
 
      result["$count"] = result.length; // Include $count for CAP consumption
      return result;
    } catch (err) {
      console.error("Failed to fetch data from MongoDB", err);
      req.reject(500, "Failed to fetch data from MongoDB");
    }
  });
 
  // // READ operation for DepartmentsByAdminType
  // this.on("READ", "DepartmentsByAdminType", async (req) => {
  //   try {
  //     let query = { adminType: "Quality User" };
 
  //     if (req.query.SELECT.where) {
  //       const whereClause = req.query.SELECT.where;
  //       for (let i = 0; i < whereClause.length; i += 2) {
  //         if (whereClause[i].ref && whereClause[i + 1] === "=") {
  //           const field = whereClause[i].ref[0];
  //           const value = whereClause[i + 2].val;
  //           query[field] = value;
  //           i++;
  //         }
  //       }
  //     }
 
  //     // Ensure adminType is included in the query
  //     if (!query.adminType) {
  //       req.reject(400, "adminType is required");
  //       return;
  //     }
 
  //     const users = await mongoCollection.find(query).toArray();
 
  //     const departments = users.reduce((acc, user) => {
  //       if (user.departments && user.departments.length > 0) {
  //         user.departments.forEach((dept) => {
  //           if (!acc.includes(dept.name)) {
  //             acc.push(dept.name);
  //           }
  //         });
  //       }
  //       return acc;
  //     }, []);
 
  //     const result = departments.map((dept) => ({
  //       adminType: query.adminType,
  //       departmentName: dept,
  //     }));
  //     console.log(result, "------------result");
  //     return result;
  //   } catch (err) {
  //     console.error("Failed to fetch data from MongoDB", err);
  //     req.reject(500, "Failed to fetch data from MongoDB");
  //   }
  // });
 
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
 
  this.on("READ", "userTypes", async (req) => {
    try {
      let query = { type: { $in: [1, 7, 10] } };
      const database = client.db("Pratham");
      mongoCollection = database.collection("userType");
      const userType = await mongoCollection.find(query).toArray();
      console.log(userType, "-----------");
      userType["$count"] = userType.length; // Include $count for CAP consumption
      return userType;
    } catch (err) {
      console.error("Failed to fetch data from MongoDB", err);
      req.reject(500, "Failed to fetch data from MongoDB");
    }
  });
 
  this.on("READ", "deptName", async (req) => {
    try {
      const database = client.db("Pratham");
      const mongoCollection = database.collection("departments");
      let query = {};
      let reqname = "";
      let accountName = [];
      if (req.query.SELECT.where) {
        const whereClause = req.query.SELECT.where;
        console.log("Where Clause:", JSON.stringify(whereClause));
        for (let i = 0; i < whereClause.length; i++) {
          if (
            whereClause[i].ref &&
            whereClause[i].ref[0] === "name" &&
            (whereClause[i + 1] === "eq" || whereClause[i + 1] === "=")
          ) {
            reqname = whereClause[i + 2].val;
            break; // Found the name field, no need to continue
          }
        }
      }
 
      console.log("Requested name:", reqname);
 
      if (reqname === "Quality User") {
        query = { name: { $ne: "Telecom" } };
        accountName = await mongoCollection.find(query).toArray();
      } else if (reqname === "Power User") {
        console.log("Fetching data for Power User");
        query = { name: "Gas Pipelines" };
        accountName = await mongoCollection.find(query).toArray();
      } else {
        console.log("No matching condition for reqname:", reqname);
      }
 
      const result = accountName.map((data) => ({ name: data.name }));
 
      if (result.length) {
        result["$count"] = result.length; // Include $count for CAP consumption
      }
 
      return result;
    } catch (err) {
      console.error("Failed to fetch data:", err);
      return [];
    }
  });
 
  this.on("disconnect", async () => {
    if (client) {
      await client.close();
      console.log("Disconnected from MongoDB.");
    }
  });
});
 