const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;


const usersSchema = new Schema({
    username: {
        type: String,
        required: [true,'Please enter username'],
    },
    password: {
        type: String,
        required: [true, 'Please enter password']
    },
    name: {
        type: String,
        required: [true, 'Please enter name'],
    },
    yob:{
        type: Number,
        required: [true, 'Please enter year of birth'],
    },
    isAdmin: {
        type: Boolean,
        default: false
    }, 
},{
    timestamps: true
});

usersSchema.set('validateBeforeSave',false);

usersSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// usersSchema.statics.login = async function(username, password) {
//     const user = await this.findOne({ username });
//     if (user) {
//       const auth = await bcrypt.compare(password, user.password);
//       if (auth) {
//         return user;
//       }
//       throw Error('incorrect password');
//     }
//     throw Error('incorrect username');
// };

var Users = mongoose.model('users', usersSchema);

module.exports = Users;
