const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

            

const nationSchema = new Schema({
    nationName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },
    
},{
    timestamps: true
});

var Nations = mongoose.model('nations', nationSchema);

module.exports = Nations;
