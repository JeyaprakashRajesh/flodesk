const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserModel = new schema({
    user_id: {
        type: Number,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true, 
        unique: true,  
    },
    password: {
        type: String,
        required: true,
    },
    project: {
        type:[
            {
                project_id : Number,
                name : String,
                member: String,
            }
        ]
    }
});

const User = mongoose.model("User", UserModel);

module.exports = User;
