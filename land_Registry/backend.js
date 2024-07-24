
const bcrypt = require('bcrypt');

const otpGen = require("otp-generator")
var nodemailer = require('nodemailer');
const express= require('express');
const app  = express()
const path= require('path')
const dr= path.join(__dirname,"/frontend")
const d= path.join(__dirname,"/example")
let otp_val = Math.floor(Math.random()*10000);

app.set('view engine', 'ejs');
const mongoose= require('mongoose');
mongoose.connect('mongodb+srv://pankajsingh00203:121Pankaj@cluster0.ifzvhji.mongodb.net/db')

const scema=  new mongoose.Schema(
    {name: String,
    state:String,
    city:String,
    propertyid:String,
    owneraddress:String,
    size:Number,
    adharNo:Number ,
     email:String,
     phone:Number,
     password:String
  })
  scema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();        

    try {
        const salt = await bcrypt.genSalt(10);
        const hashvalue = await bcrypt.hash(user.password, salt);
        user.password = hashvalue;
        next();
    } catch (error) {
        return next(error);
    }
});


const model= mongoose.model("landrecords",scema)
const newModel= mongoose.model("tables",scema)
const md= mongoose.model("sigs",scema)
const secondModel= mongoose.model("verifylands",scema)

app.use(express.json())
app.use(express.static(dr))
 app.use(express.urlencoded({extended:false}))

app.get('/',(req,res)=>{
  
     res.sendFile(dr+"/login.html")             
})

app.get('/check',async(req,res)=>{
  const email= await md.findOne({email:req.query.email})
  
    console.log("email===",email)
    if(email!=null){
    if(await bcrypt.compare(req.query.password,email.password))
    res.sendFile(dr+"/nav.html")
  else{
    res.sendFile(dr+"/home.html")
  
  }
    }
  else{
    res.sendFile(dr+"/home.html") 
    
  }
 })

app.get('/registation_form',(req,res)=>{
    res.sendFile(dr+"/frontend.html")
})

app.post('/deposite',async(req,res)=>{
  const result=  new newModel(req.body)

  // const  id= result.propertyid
  // console.log("iddddd===",id)
  // const find=  await model.findById({_id:id})
  // console.log("find===",find)

  //  if(find==null){
  //   res.send(`<html>
  //   <body>
  //       <form id="redirectForm" action="/registation_form" method="get">
  //           <input type="hidden" name="data" value="anyDataYouWantToSend">
  //       </form>
  //       <script>
  //         alert("invalid propertyid!")
  //           document.getElementById('redirectForm').submit();
  //       </script>
  //   </body>
  // </html>`)
  //  }
  //  else{

      const data=await result.save()
      console.log(data)    
      res.sendFile(dr+"/pay.html")  
  //  }
   })

app.post("/otppg",async(req,res)=>{

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '2020534366.pankaj@ug.sharda.ac.in',
      pass: 'vzcs ivtz umzy hzpy'
    }
  });
  
  var mailOptions = {
    from: '2020534366.pankaj@ug.sharda.ac.in',
    to: 'pankajsingh00203@gmail.com',
    subject: 'this mail is to generate otp',
    text: `this is your otp ${otp_val}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {    
      console.log('Email sent: ' + info.response);
    }
  })  

 
  const find=   await newModel.findOne().sort({_id:-1})
  const result= await new model({name: find.name,
    state:find.state,
    city:find.city,
    propertyid:find.propertyid,
    owneraddress:find.owneraddress,
    size:find.size,
    adharNo:find.adharNo ,
     email:find.email,
     phone:find.phone})

const data=   await result.save()
console.log('data=',data)

const id=   find.propertyid
   console.log("id==",id)
 const del= await model.findByIdAndDelete(id)   
  console.log("deleted id=",del)   
     console.log("otp=",otp_val)        
   
     res.render('otp',{otp:otp_val})

   })  

   app.get('/generateqr',async(req,res)=>{
   
    const data= await model.findOne().sort({_id:-1})
    
     res.send(`<!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>QR CODE GENERATOR</title>
         <link rel="stylesheet" href="font.css">
         <link rel="stylesheet" href="style.css" />
       </head>
       <body>
     
      <main>
       <h2>Qr Code</h2>
       <input id="input" type="text" placeholder="Text or Url"value= "${data}">
       <button onclick="generateQrCode()" id="generateBtn">Generate</button>
       <div class="qrbox">
         <img id="img" src="demo.png" >
       </div>
       <button onclick="download()">Download</button>
     
      </main>
      <a href="/nav"><button style="background-color: gray; color: white;">Home</button></a>  
     <script src="script.js"></script>
       </body>
     </html>`)    
    
 })

app.get("/nav",(req,res)=>{
  res.sendFile(dr+"/nav.html")
})
app.get("/verify",(req,res)=>{
  res.sendFile(d+"/adhar.html")
})
app.get("/pg",async(req,res)=>{
  console.log("adhar no==",req.query.adharNo)
  const find= await model.findOne({adharNo:req.query.adharNo})  
  console.log(find)
 
  if(find==null){
    res.send("adhar is not linked with this land registry, you cannot access the property information")
  }
  // twilio code.....................
  else{
    const result= await new secondModel({name: find.name,
      state:find.state,
      city:find.city,
      propertyid:find.propertyid,
      owneraddress:find.owneraddress,
      size:find.size,
      adharNo:find.adharNo ,
       email:find.email,
       phone:find.phone})
       const data=await result.save()
//     let otp = otpGen.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets:
//       false, specialChars: false })

//       var sid = "[enter sid]";
// var auth_token = "[ENTER AUTH_TOKEN}";
// var twilio = require("twilio")(sid, auth_token);

// twilio.messages
//     .create({
//         from: "[ENTER TWILIO NO]",
//         to: "[ENTER YOUR NO]",
//         body: `this is testing otp is ${otp}`,
//     })
//     .then(function (res) { console.log("otp has sent to register mobile !") })                
//     .catch(function (err) {
//         console.log(err);
//     });
   res.render('mobileotp',{otp:123})
  }
})

app.get('/qr',async(req,res)=>{

  const results= await secondModel.findOne().sort({_id:-1})
  res.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>QR CODE GENERATOR</title>
      <link rel="stylesheet" href="font.css">
      <link rel="stylesheet" href="style.css" />
    </head>
    <body>
  
   <main>
    <h2>Qr Code</h2>
    <input id="input" type="text" placeholder="Text or Url"value= "${results}">
    <button onclick="generateQrCode()" id="generateBtn">Generate</button>
    <div class="qrbox">
      <img id="img" src="demo.png" >
    </div>
    <button onclick="download()">Download</button>
  
   </main>
   <a href="/nav"><button style="background-color: gray; color: white;">Home</button></a>  
  <script src="script.js"></script>
    </body>
  </html>`)
 })
 app.get('/link1',(req,res)=>{
  res.sendFile(dr+"/link1.html")
 })



 app.post('/submited',async(req,res)=>{

  const email= await md.findOne({email:req.body.email})

  if(email!=null){
    res.send(`<html>
    <body>
        <form id="redirectForm" action="/" method="get">
            <input type="hidden" name="data" value="anyDataYouWantToSend">
        </form>
        <script>
          alert("User already exist")
            document.getElementById('redirectForm').submit();
        </script>
    </body>
  </html>`)
  }
  else{
 
  const result=  new md(req.body)
  const data=await result.save()
  console.log(data)
  res.send(`
  <html>
    <body>
        <form id="redirectForm" action="/" method="get">
            <input type="hidden" name="data" value="anyDataYouWantToSend">
        </form>
        <script>
            document.getElementById('redirectForm').submit();
        </script>
    </body>
  </html>
  `)
  }
  
 })
 //......................................................
 app.get('/ipfs',(req,res)=>{

  res.send(`
  
  `)
 })
 app.get('/sub', async (req, res) => {
  try {
      // Fetch data synchronously
      const data = await model.findOne().sort({ _id: -1 });

      // Construct QR code URL
      const img= `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`

      // Construct HTML content including QR code image
      const invoiceHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" crossorigin="anonymous">
              <style>
                  /* Your CSS styles here */
              </style>
          </head>
          <body>
              <div class="container d-flex justify-content-center mt-50 mb-50">
                  <div class="row">
                      <div class="col-md-12 text-right mb-3">
                          <button class="btn btn-primary" id="download">Download PDF</button>
                      </div>
                      <div class="col-md-12">
                          <div class="card" id="invoice">
                              <div class="card-header bg-transparent header-elements-inline">
                                  <h6 class="card-title text-primary">Sale invoice</h6>
                              </div>
                              <div class="card-body">
                                  <div class="d-md-flex flex-md-wrap">
                                      <div class="mb-4 mb-md-2 text-left">
                                          <span class="text-muted">Invoice To:</span>
                                          <ul class="list list-unstyled mb-0">
                                              <!-- Populate data from MongoDB -->
                                              <li><h5 class="my-2">Land Registry Data</h5></li>
                                              <li>Name: ${data.name}</li>
                                              <li>State: ${data.state}</li>
                                              <li>City: ${data.city}</li>
                                              <li>PropertyId: ${data.propertyid}</li>
                                              <li>Owners Address: ${data.owneraddress}</li>
                                              <li>Adhar NO: ${data.adharNo}</li>
                                              <li>Email: ${data.email}</li>
                                              <li>Contact NO: ${data.phone}</li>
                                            
                                          </ul>
                                      </div>
                                      <div class="qrbox">
                                          <!-- Include the QR code image directly -->
                                          <img id="img" src="${img}" alt="QR Code">
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.js"></script>
              <script>
              function generatePDF() {
                const invoice = document.getElementById("invoice");
                const img = document.getElementById("img");

                var opt = {
                    margin: 1,
                    filename: 'myfile.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().from(invoice).set(opt).save();
            }
            
            window.onload = function () {
                document.getElementById("download").addEventListener("click", generatePDF);
            }
                  // Your JavaScript code here
              </script>
          </body>
          </html>`;

      // Send the HTML content with QR code included
      res.send(invoiceHTML);
  } catch (error) {
      // Handle any errors
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});


let PORT= process.env.PORT||9000

app.listen(PORT,()=>{
  console.log(`Port is running on ${PORT}`)
})    

