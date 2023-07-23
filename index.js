
const express = require('express')
const app = express()

const cors = require('cors');
require('dotenv').config()
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 4000
app.use(cors())
app.use(express.json())





const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization
  
    if (!authorization) {
      return res.status(401).send({ error: true, message: "authorxation access" })
    }
  
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ error: true, message: "authorxation access" })
      }
      req.decoded = decoded
  
      next();
    })
  
  }




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSCODE}@cluster0.scwz6ce.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {
  


    const allUserCollection = client.db("end-game").collection("user-identity")
    const collegedetails = client.db("end-game").collection("college-details")
    const admissiondata = client.db("end-game").collection("admission-data")




app.get("/useridentity", async(req,res)=>{
    const result = await allUserCollection.find().toArray()
    res.send(result)
})





app.post('/jwt', (req, res) => {
    const user = req.body
    const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '30d' })
    res.send({ token })
  })

  


  app.get('/findgmaildetails',  async (req, res) => {

    const getData = req.query.id
    const findData = { _id : new ObjectId(getData) };
    const result = await allUserCollection.findOne(findData)

    res.send(result)
  })


  app.get('/collegedetails',  async (req, res) => {

  
    const result = await collegedetails.find().toArray()

    res.send(result)
  })











app.post("/userdetailsadd", async(req,res)=>{
    const getdata = req.body
    const sameidcheck = { email: getdata.email}
   const findData = await  allUserCollection.findOne(sameidcheck)
   if(findData){
    return res.status(400).send({ message: "Data already exists" });
   }

    const result = await allUserCollection.insertOne(getdata)
    res.send(result)
})

app.post('/admissionformdetails', async(req,res)=>{
  const getdata= req.body
  const datafind = getdata.usergmail
  const datafinds = getdata.collegeID
  const findData = { usergmail : datafind};
  const findDatatwo = { collegeID : datafinds};
  const searchdata = await admissiondata.findOne(findData)
  const searchdatas = await admissiondata.findOne(findDatatwo)

  if(searchdata && searchdatas){
    return res.status(400).send({ message: "Data already exists" });
  }

  const result = await admissiondata.insertOne(getdata) 
    res.send(result)

})











app.put("/updateuserdetails/:id", async (req, res) => {
    const getId = req.params.id
    const { email,displayName,phone,university,blood,address } = req.body
    const findData = { _id : new ObjectId(getId) };

    const updateinstructor = {

      $set: {
        update_email: email,
        displayName: displayName,
        phone: phone,
        university: university,
        blood: blood,
        address:address



      }
    }

    const result = await allUserCollection.updateOne(findData, updateinstructor)
    res.send(result)
  })





  } finally {

 
  }
}
run().catch(console.dir);







  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })