const express = require('express')
const jwt = require('jsonwebtoken')
const Collection = require('./mongo')
const cookieParse = require('cookie-parser')
const bcrypt = require('bcryptjs')

const app = express()

const path = require("path")

const key = "dghsyuierihhbcjhxguifhdlhfidyrooeiuroeytherytiyfhkdhrfiueyfkjbergfhkdbfkjdtgfuibchegfyvdbhcbydgfmdb"

app.use(express.json())
app.use(cookieParse())
app.use(express.urlencoded({extended:false}))

const templatePath = path.join(__dirname,"..","templates")
const publicPath = path.join(__dirname,"..","public")

app.set('view engine', 'hbs')
app.set('views',templatePath)
app.use(express.static(publicPath))

async function hashPass(password){
    const result = await bcrypt.hash(password,10)
    return result
}

async function compare(userPass,hashPass){
    const result = await bcrypt.compare(userPass,hashPass)
    return result
}


app.get('/login', (req,res) => {
  if(req.cookies.jwt){
    const verify = jwt.verify(req.cookies.jwt,key)
    res.render("home",{name:verify.name})
  } else{
    res.render("login")
  }
})

app.get('/signup', (req,res) => {
    res.render('signup')
})
app.post('/signup', async (req, res) => {
    try {
        const check = await Collection.findOne({ name: req.body.name });
        const hashedpassword = await hashPass(req.body.password)
        if (check) {
            return res.send("User already exists");
        } else {
            const token = jwt.sign({ name: req.body.name }, key);
            res.cookie("jwt",token,{
                maxAge:600000,
                httpOnly:true
            })

            const data = {
                name: req.body.name,
                password: hashedpassword,
                token: token
            };

            await Collection.create(data);
            return res.send("Signup successful"); 
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong"); 
    }
});


app.post('/login', async (req, res) => {
    try {
        const check = await Collection.findOne({ name: req.body.name });
       
        const passCheck = await compare(req.body.password,check.password)
        if (check && passCheck) {
            res.cookie("jwt",check.token,{
                maxAge:600000,
                httpOnly:true
            })
            res.render("home", {name:req.body.name})
      
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong"); 
    }
});

app.listen(3000, () => {
    console.log("server is listening...");
})