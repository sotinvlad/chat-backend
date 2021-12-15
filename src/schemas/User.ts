import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

const UserSchema = new Schema({
    email: {
        unique: true,
        type: String,
        validate: [ validator.isEmail, 'Email is not correct' ],
        lowercase: true
    },
    avatar: String,
    fullname: {
        type: String,
        required: 'Fullname is required',
    },
    password: {
        type: String,
        required: 'Password is required',
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    last_seen: Date
},
{
    timestamps: true
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;