const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;


const playerSchema = new Schema({
    // name: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // image: {
    //     type: String,
    //     required: false,
    // },
    // club: {
    //     type: String,
    //     required: false,
    // },
    // position: {
    //     type: String,
    //     required: false,
    // },
    // goals: {
    //     type: String,
    //     required: false,
    // },
    // isCaptain: {
    //     type: Boolean,
    //     required: false,
    // },

    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    club: {
        type: String,
        required: true,
        required: true      
    },
    position: {
        type: String,
        required:true,
        required:true
    },
    goals: {
        type:Number,
        required:false
    },
    isCaptain:{
        type: String,
        default:"No",
        required:true
    },
    nation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nations'
    }
    
},{
    timestamps: true
});

var Players = mongoose.model('players', playerSchema);

module.exports = Players;
