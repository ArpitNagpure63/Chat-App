import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    profilepic: {
        type: String,
        require: true
    }
}, { timestamps: true });

const Users = mongoose.model('Users', UserSchema);

export default Users;