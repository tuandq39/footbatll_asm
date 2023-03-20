const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    email:{
        type:String,
        unique: true
    },
    otp: String,
    time:{
        type:Date,
        default: Date.now,
        index:{expires:20}
    }
})

var OTP = mongoose.model("OTP",OTPSchema)
module.exports = OTP;