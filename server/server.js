const express=require("express")
port=5300;
const bodyParser=require("body-parser")
const cors=require("cors");
const {MongoClient, ObjectId}=require("mongodb");
const eobj=express();
const URL = "mongodb://localhost:27017";
const client=new MongoClient(URL)

// middleware
eobj.use(cors());
eobj.use(bodyParser.json())

// for set connection 
async function getConnection(){
    let result=await client.connect();
    let db=result.db("Marvellous24");
    return db.collection("Batch24");
    
}

//to read data
 eobj.get("/api/read",async(req,res)=>{
    try{
        let data=await getConnection();
        let result=await data.find().toArray();
        res.status(200).json(result)
 
    }catch(err){
        res.status(500).json({error:"failed to retrive data",details:err.message})
    }
    
 }
);

//to post data
eobj.post("/api/insert",async(req,res)=>{
    try{
        const batch=req.body;
        let data=await getConnection();
        let result=await data.insertOne(batch)
        res.status(201).json({message:"data inserted successfully",result})
    }catch(err){
        res.status(500).json({error:"failed to send data",details:err.message})
    }
})

//to delete data
eobj.delete("/api/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Received ID:", id);

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        let data = await getConnection();
        const result = await data.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Record deleted successfully" });
        } else {
            res.status(404).json({ message: "Record not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to delete record", details: err.message });
    }
});


 

// to update data

eobj.put("/api/update/:id", async (req, res) => {
    const id = req.params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    const body = req.body;

    try {
        const data = await getConnection();
        const result = await data.updateOne(
            { _id: new ObjectId(id) },  // Ensure ObjectId is constructed properly
            { $set: body }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({ message: "Record updated successfully" });
        } else {
            res.status(404).json({ message: "No record found with the given ID" });
        }
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//to BatchgetbyID
eobj.get("/api/getByid/:id", async (req, res) => {
    try {
      const id = req.params.id;
  
      // Validate ID format
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
          error: "INVALID_ID_FORMAT",
        });
      }
  
      const data = await getConnection();
      const result = await data.findOne({ _id: new ObjectId(id) });
  
      if (result) {
        res.status(200).json({
          success: true,
          data: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Record not found",
          error: "RECORD_NOT_FOUND",
        });
      }
    } catch (error) {
      console.error(`Error getting record: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  });

// function main(){
//     let ret;
//     ret=getConnection();
//     console.log("database connection is successfull");
//     // readData();
//     // insertBatch();
//     // updateBatch();

// }
// main();

eobj.listen(port,()=>{
    console.log(`serverr running on http://localhost:${port}`)
})