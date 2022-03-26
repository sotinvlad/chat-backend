import mongoose, { Schema } from 'mongoose';

const DialogSchema = new Schema({
    dialogParticipants: [
        {
            user : {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            unreadedMessages: {
                type: Number,
                default: 0,
            }
        }
],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
},
{
    timestamps: true
});

const DialogModel = mongoose.model("Dialog", DialogSchema);

export default DialogModel;