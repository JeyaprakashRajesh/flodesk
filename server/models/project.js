const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProjectModel = new schema({
    project_id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            user_id: {
                type: Number,
                required: true
            },
            username: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            }
        }
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
    backgroundcolor : {
        type : String,
        default : "#212121",
        required : true
    }
});


const Project = mongoose.model("Project", ProjectModel);

module.exports = Project;
