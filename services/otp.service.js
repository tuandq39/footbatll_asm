'use strict'

const bcrypt = require("bcrypt");
const OTP = require('../models/otp')

var that = module.exports = {
    validOtp: async({
        otp,
        hashedOtp
    }) => {
        try{
            const isValid = await bcrypt.compare(otp,hashedOtp)
            return isValid
        }catch(error){

        }
    },

    insertOtp: async({
        otp,
        email
    }) =>{
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedOtp = await bcrypt.hash(otp,salt)
            const Otp = await OTP.create({
                email,
                otp: hashedOtp
            })

            return Otp ? true : false;

        }catch(error){
            console.log(error);
        }
    }
}