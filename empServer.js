let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Headers",
 "Origin,X-Requested-With,Content-Type,Accept");
 res.header("Access-Control-Allow-Credentials", true);
 next();
})
let port = process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));
let { employees } = require("./empData.js");
let cookieparser = require("cookie-parser");
app.use(cookieparser("abc-123"));

app.post("/login",function(req,res){
 let { empCode, name} = req.body;
 let emp = employees.find((e1)=>e1.empCode===+empCode && e1.name===name);
 if(!emp) {
    res.cookie("tracker",{user:"Guest",url:req.url,date:Date.now()},{maxAge:150000,signed:true})
    res.status(404).send("Login failed");
 }
 else{
    res.cookie("empCode",empCode,{maxAge:150000,signed:true});
    res.cookie("tracker",{user:name,url:req.url,date:Date.now()},{maxAge:150000,signed:true})
    res.send({
       empCode: emp.empCode,
       name: emp.name
    });
 }
})
app.get("/logout",function(req,res){
 res.clearCookie("empCode");
 res.send("Cookie cleared");
})
app.get("/myDetails",function(req,res){
 let empCode = req.signedCookies.empCode;
 console.log(empCode);
  if(!empCode)
  res.status(401).send("No access.Please login first");
  else{
    let emp = employees.find((e1)=>e1.empCode===+empCode);
    if(emp) res.send(emp);
    else
    res.status(404).send("Employee Code Not Matched");
  }
})
app.get("/company",function(req,res){
  res.send("Welcome to the Employee Portal of XYZ Company")
})
app.get("/myJuniors",function(req,res){
 let empCode = req.signedCookies.empCode;
 if(!empCode) res.status(404).send("No access.Please login first");
 else{
 let emp = employees.find((e1)=>e1.empCode===+empCode);
 if(emp){
    let emp1 = [];
    if(emp.designation==="VP")
    emp1 = employees.filter((e1)=>e1.designation==="Manager"|| e1.designation==="Trainee");
    else if(emp.designation==="Manager")
    emp1 = employees.filter((e1)=>e1.designation=="Trainee");
    else if(emp.designation==="Trainee")
    emp1 = "There is no junior";
    res.send(emp1);
 }else res.status(401).send("Employee Code Not Matched");
 }
})
app.get("/tracker",function(req,res){
 let tracker = req.signedCookies.tracker;
  res.send(tracker);
})