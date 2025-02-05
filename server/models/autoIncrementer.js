const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AutoIncrementerSchema = new schema({
    user_id: {
        type: Number,
        default: 1,
    },
    project_id: {
        type: Number,
        default: 1,
    }
});

const AutoIncrementer = mongoose.model("AutoIncrementer", AutoIncrementerSchema);

async function getAndIncrementUserId() {
    try {
        let autoIncrementDoc = await AutoIncrementer.findOne();
        if (!autoIncrementDoc) {
            autoIncrementDoc = new AutoIncrementer({ user_id: 1, project_id: 1 });
            await autoIncrementDoc.save();
        }
        const currentUserId = autoIncrementDoc.user_id;
        autoIncrementDoc.user_id = currentUserId + 1;
        await autoIncrementDoc.save();
        return currentUserId;
    } catch (err) {
        console.error("Error in AutoIncrementer:", err);
        throw err;
    }
}

async function getAndIncrementProjectId() {
    try {
        let autoIncrementDoc = await AutoIncrementer.findOne();
        if (!autoIncrementDoc) {
            autoIncrementDoc = new AutoIncrementer({ user_id: 1, project_id: 1 });
            await autoIncrementDoc.save();
        }
        const currentProjectId = autoIncrementDoc.project_id;
        autoIncrementDoc.project_id = currentProjectId + 1;
        await autoIncrementDoc.save();
        return currentProjectId;
    } catch (err) {
        console.error("Error in AutoIncrementer:", err);
        throw err;
    }
}

module.exports = { AutoIncrementer, getAndIncrementUserId, getAndIncrementProjectId };
