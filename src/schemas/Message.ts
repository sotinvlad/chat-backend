import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
    text: String,
    dialogId: {
        type: Schema.Types.ObjectId,
        ref: "Dialog",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true
});

const MessageModel = mongoose.model("Message", MessageSchema);

export default MessageModel;