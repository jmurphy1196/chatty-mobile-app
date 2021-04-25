import { Socket, io } from "socket.io-client";
import { store } from "./redux";
import { ActionTypes } from "./redux/action-types";

enum EventTypes {
  userDisconnect = "disconnect",
  postMessage = "post message",
  messageRecieved = "message recieved",
}

interface messageRecieved {
  message: ChatData;
  clientId?: string;
}

export interface ChatData {
  id?: string;
  recipient: string;
  content: string;
  status: "sent" | "read" | "sending";
  created_at?: string;
  sender: string;
  clientId?: string;
}

class SocketService {
  socket: Socket;
  token: string;
  constructor(userToken: string) {
    this.token = userToken;
    this.socket = io("https://new-chatty-backend.herokuapp.com", {
      query: { token: `Bearer ${userToken}` },
      autoConnect: false,
    });
    this.onMessage();
  }

  connect() {
    this.socket.connect();
  }
  disconnect() {
    this.socket.disconnect();
  }
  postMessage(msg: ChatData) {
    //check connecttion
    if (this.socket.connected) {
      this.socket.emit(EventTypes.postMessage, msg);
      return true;
    }
    return false;
  }
  onMessage() {
    this.socket.on(EventTypes.messageRecieved, (msg: messageRecieved) => {
      if (msg.clientId) {
        //message was from client

        store.dispatch({
          type: ActionTypes.MESSAGE_SENT,
          payload: {
            clientId: msg.clientId,
            recipient: msg.message.recipient,
          },
        });
      } else {
        //this is a message from users friend
        store.dispatch({
          type: ActionTypes.MESSAGE_RECIEVED,
          payload: {
            message: msg.message,
          },
        });
      }
    });
  }
}

export default SocketService;
