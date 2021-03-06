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
    },
    attachments: {
        type: [String]
    },
    isReaded: {
        type: Boolean,
        default: false
    }, 
    isAudio: {
        type: Boolean,
        default: false
    },
    audio: {
        type: String,
        default: null
    }
},
{
    timestamps: true
});

const MessageModel = mongoose.model("Message", MessageSchema);

export default MessageModel;