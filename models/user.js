const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;


const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    yob:{
        type: Number,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }, 
},{
    timestamps: true
});

usersSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

var Users = mongoose.model('users', usersSchema);

module.exports = Users;
