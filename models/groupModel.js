const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the name'],
        minLength: 3,
        maxLength: 50
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please add the author']
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
    ]
},
    {
        timestamps: true,
    }
)


module.exports = mongoose.model('Group', groupSchema);