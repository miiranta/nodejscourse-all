const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task = require("./task")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        validate: {validator: (v)=>{  if(v<0){throw new Error("Age is negative")}  }}
    },

    email: {
        required: true,
        unique: true,
        type: String,
        trim: true,
        lowercase: true,
        validate: {validator: (v) => {  if(!validator.isEmail(v)){throw new Error("Email invalid")}  }}
        

    },

    password: {
        type: String,
        required: true,
        trim: true,
        validate: {validator: (v) => {  if(v.toLowerCase().includes('password')){throw new Error("Password cannot include password")}  }},
        minLength: 6
    },

    tokens:[{
        token: {
            type: String,
            required: true
        }
    }],

    avatar: {
        type: Buffer
    }

}, {

    timestamps: true
    
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function (){

    const user = this

    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET,{expiresIn:'1 days'})
    
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({email})
    if(!user){throw new Error("Unable to login")}

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){throw new Error("Unable to login")}

    return user
}

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//Hashing
userSchema.pre('save', async function (next){

    const user = this

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})


//Delete User tasks when removed
userSchema.pre('remove', async function(next){

    const user = this
    await Task.deleteMany({owner: user._id})

    next()

})


const User = mongoose.model('User', userSchema)

module.exports = User