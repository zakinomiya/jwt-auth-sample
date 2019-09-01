{const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// defining the schema of user stored in the db
const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value: string)=> {
            if(!validator.isEmail(value)){
                throw new Error ('Invalid Email addres')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// to do some logics in-between the creation of the object and storing of the object
userSchema.pre('save', async function (this: any , next: any){
    const user = this;
    if( user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})


userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user.id}, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
    const user = await User.findOne({email});
    if( !user ){
        throw new Error('Invalid logain credentials');
    }
    const isPasswordMatch: boolean = await bcrypt.compare(password, user.password);
    if( !isPasswordMatch){
        throw new Error('Invalid login credentials');
    }
    return user;
}
const User = mongoose.model('User', userSchema)

module.exports = User}