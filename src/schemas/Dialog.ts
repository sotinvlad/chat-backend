import mongoose, { Schema } from 'mongoose';

const DialogSchema = new Schema({
    dialogParticipants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    }
},
{
    timestamps: true
});

const DialogModel = mongoose.model("Dialog", DialogSchema);

export default DialogModel;