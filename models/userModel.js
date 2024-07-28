const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the name'],
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'Please add the Email'],
        maxLength: 100,
        unique: [true, 'Email address already taken']
    },
    username: {
        type: String,
        required: [true, 'Please add the UserName'],
        minLength: 5,
        maxLength: 50,
        unique: [true, 'UserName address already taken']
    },
    password: {
        type: String,
        required: [true, 'Please add the Password']
    },
},

    {
        timestamps: true,
    })

module.exports = mongoose.model('User', userSchema);