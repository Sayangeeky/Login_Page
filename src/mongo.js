const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:wieTYUfV5EA48FzK@cluster0.ngudhn8.mongodb.net/')
.then(() => {
    console.log("DB CONNECTED...");
})
.catch((err) => {
    console.log(err);
})

const schema = new mongoose.Schema({
name:{
    type: String,
    required: true
},
password:{
    type: String,
    required: true
},
token:{
    type:String,
    required:true
}
})

const Collection =  mongoose.model("AuthCollectiob", schema)

module.exports = Collection