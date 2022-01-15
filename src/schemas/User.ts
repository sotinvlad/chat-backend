import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
    email: string;
    fullname: string;
    password: string;
    confirmed: boolean;
    avatar: string;
    confirm_hash: string;
    last_seen: Date;
    data?: IUser;
  }

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
    confirm_hash: String,
    last_seen: String
},
{
    timestamps: true
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;