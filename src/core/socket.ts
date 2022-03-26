import http from 'http';
import jwt from 'jsonwebtoken';
import { setInterval } from 'timers';
import { Server } from 'socket.io';

import DialogModel from '../schemas/Dialog';
import MessageModel from '../schemas/Message';

const createSocketServer = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  });
  console.log('WebSocket server is active')
  io.use((socket, next) => {
    jwt.verify(socket.handshake.auth.token, process.env.ACCESS_TOKEN_SECRET || '', (err: any, decodedData: any) => {
        if (err) next(new Error('Invalid token'));
        if (decodedData){ 

           socket.data = decodedData;
        } else {
            next();
        }
    })
    next();
  })

  io.on("connection", (socket) => {
    console.log(`${socket.data.email} connected`);
    DialogModel.where({'dialogParticipants.user': socket.data._id}).find((err: any, dialogs: any) => {
      if (err){
          console.log(err);
          return;
      }
      dialogs.forEach((dialog: any) => socket.join('dialogId:' + dialog._id))
    })
    setInterval(() => socket.emit('SERVER:UPDATE_STATUS'), 10000);
    socket.on('CLIENT:MESSAGE_IS_READED', (messageId) => {
      MessageModel
      .findByIdAndUpdate(messageId, { isReaded: true } as any, { new: true})
      .populate('user')
      .exec((err, message) => {
        if (!err){
          io.to('dialogId:' + message.dialogId.toString()).emit('SERVER:MESSAGE_UPDATE', message);
          DialogModel.findById(message.dialogId).populate('lastMessage').populate('dialogParticipants.user').exec((_:any, dialog: any) => {
            dialog.dialogParticipants.forEach((obj: any, index: any, dialogParticipants: any) =>{
              console.log(obj.user._id, socket.data._id)
              if(obj.user._id.toString() === socket.data._id.toString()){
                dialogParticipants[index].unreadedMessages = 0;
              }
            })
            dialog.save().then(() => io.to('dialogId:' + dialog._id).emit('SERVER:UPDATE_DIALOG', dialog));
          })
        }
      })
    })
  });

  return io;
}

export default createSocketServer;




