import produce from "immer";
import { Reducer } from "redux";
import { Action } from "../actions";
import { ActionTypes } from "../action-types";
import { ChatData } from "../../socket-service";

export interface FriendState {
  firstName?: string;
  lastName?: string;
  email: string;
  messages: Array<ChatData>;
  loading?: boolean;
}

export interface FriendRequestState {
  id: string;
  sender: string;
  recipient: string;
  status: "confirmed" | "pending" | "denied";
}

interface DataState {
  friends: {
    [key: string]: FriendState;
  };
  friendRequests: {
    [id: string]: FriendRequestState;
  };
  myFriendRequestOrder: Array<FriendRequestState>;
  mySentFriendRequestOrder: Array<FriendRequestState>;
  userEmail: string;
}

const initialState: DataState = {
  friends: {},
  friendRequests: {},
  myFriendRequestOrder: [],
  mySentFriendRequestOrder: [],
  userEmail: "",
};

const reducer: Reducer<DataState, Action> = produce(
  (state = initialState, action: Action) => {
    switch (action.type) {
      case ActionTypes.LOG_IN: {
        const { friends, email } = action.payload;
        state.userEmail = email;
        for (let friendEmail of friends) {
          state.friends[friendEmail] = { email: friendEmail, messages: [] };
        }
      }
      case ActionTypes.LOADING_FRIEND: {
        const { email } = action.payload;
        if (state.friends[email]) {
          state.friends[email].loading = true;
        }
        return state;
      }
      case ActionTypes.GET_FRIENDS: {
        const { friends } = action.payload;
        console.log("Friends payload");
        console.log(friends);
        friends.forEach((friend) => {
          state.friends[friend.email].firstName = friend.firstName;
          state.friends[friend.email].lastName = friend.lastName;
          state.friends[friend.email].loading = false;
        });
        return state;
      }
      case ActionTypes.GET_FRIEND: {
        const { firstName, lastName, email } = action.payload;
        if (!state.friends[email]) {
          state.friends[email] = {
            firstName,
            lastName,
            email,
            messages: [],
            loading: false,
          };
        } else {
          state.friends[email].firstName = firstName;
          state.friends[email].lastName = lastName;
          state.friends[email].loading = false;
        }
        return state;
      }
      case ActionTypes.SEND_FRIEND_REQUEST: {
        const { id, recipient, sender, status } = action.payload;
        state.friendRequests[id] = {
          id,
          recipient,
          sender,
          status,
        };
        state.mySentFriendRequestOrder.push({
          id,
          recipient,
          sender,
          status,
        });
        return state;
      }
      case ActionTypes.SET_DUMMY_MESSAGES: {
        const { messages, friendEmail } = action.payload;
        state.friends[friendEmail].messages = messages;
        return state;
      }
      case ActionTypes.SEND_MESSAGE: {
        const {
          content,
          recipient,
          sender,
          created_at,
          clientId,
        } = action.payload;
        console.log("THIS IS THE CLIENTID THAT WAS SENT OFF");
        console.log(clientId);
        state.friends[recipient].messages.push({
          status: "sending",
          sender,
          content,
          created_at,
          recipient,
          clientId,
        });
        return state;
      }
      case ActionTypes.MESSAGE_SENT: {
        const { clientId, recipient } = action.payload;
        state.friends[recipient].messages.forEach((message) => {
          if (message.clientId === clientId) {
            message.status = "sent";
          }
        });
        return state;
      }
      case ActionTypes.GET_MESSAGES: {
        const { friendEmail, messages } = action.payload;
        //terrible way to check id, maybe refactor data
        messages.forEach((message) => {
          let existingMessage = false;
          state.friends[friendEmail].messages.forEach(({ id, clientId }) => {
            if (id === message.id || clientId) existingMessage = true;
          });
          if (!existingMessage) {
            state.friends[friendEmail].messages.push(message);
          }
        });
        return state;
      }
      case ActionTypes.MESSAGE_RECIEVED: {
        const {
          message: { content, created_at, id, recipient, sender, status },
        } = action.payload;
        //message from friend
        state.friends[sender].messages.push({
          content,
          sender,
          recipient,
          status,
          created_at,
          id,
        });
      }
      case ActionTypes.LOG_OUT: {
        state = initialState;
        return state;
      }
      case ActionTypes.GET_FRIEND_REQUESTS: {
        const { friendRequests } = action.payload;
        friendRequests.forEach((request) => {
          if (!state.friendRequests[request.id]) {
            state.friendRequests[request.id] = request;
            if (request.sender === state.userEmail) {
              state.mySentFriendRequestOrder.push(request);
            } else {
              state.myFriendRequestOrder.push(request);
            }
          }
        });
        return state;
      }
      case ActionTypes.ACCEPT_FRIEND_REQUEST: {
        const { id, recipient, sender, status } = action.payload;
        delete state.friendRequests[id];
        const ind = state.myFriendRequestOrder.findIndex(
          (request) => request.id === id
        );
        console.log("ind to delete ", ind);
        if (ind !== -1) {
          state.myFriendRequestOrder.splice(ind, 1);
        }

        return state;
      }
    }

    return state;
  }
);

export default reducer;
