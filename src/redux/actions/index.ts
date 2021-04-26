import { ActionTypes } from "../action-types";
import { ChatData } from "../../socket-service";
import { FriendRequestState } from "../reducers/data-reducer";

interface FriendData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface Login {
  type: ActionTypes.LOG_IN;
  payload: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    friends: string[];
    token: string;
  };
}

export interface Logout {
  type: ActionTypes.LOG_OUT;
  payload: undefined;
}

export interface GetUser {
  type: ActionTypes.GET_USER;
  payload: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    friends: string[];
    token: string;
  };
}

export interface LoadingUser {
  type: ActionTypes.LOADING_USER;
  payload: {
    loading: true;
  };
}

export interface Signout {
  type: ActionTypes.LOG_OUT;
  payload: undefined;
}

export interface MessageRecieved {
  type: ActionTypes.MESSAGE_RECIEVED;
  payload: {
    message: ChatData;
  };
}

export interface GetFriends {
  type: ActionTypes.GET_FRIENDS;
  payload: {
    friends: Array<FriendData>;
  };
}
export interface GetFriend {
  type: ActionTypes.GET_FRIEND;
  payload: FriendData;
}

export interface LoadingFriend {
  type: ActionTypes.LOADING_FRIEND;
  payload: {
    email: string;
  };
}

export interface SendFriendRequest {
  type: ActionTypes.SEND_FRIEND_REQUEST;
  payload: {
    sender: string;
    recipient: string;
    status: "pending" | "confirmed" | "denied";
    id: "string";
  };
}

export interface GetMessages {
  type: ActionTypes.GET_MESSAGES;
  payload: {
    messages: Array<ChatData>;
    friendEmail: string;
  };
}
export interface SetDummyMessages {
  type: ActionTypes.SET_DUMMY_MESSAGES;
  payload: {
    friendEmail: string;
    messages: Array<ChatData>;
  };
}

export interface ResetFetchMessages {
  type: ActionTypes.RESET_FETCH_MESSAGE;
  payload: undefined;
}

export interface SendMessage {
  type: ActionTypes.SEND_MESSAGE;
  payload: {
    content: string;
    sender: string;
    recipient: string;
    created_at: string;
    clientId: string;
  };
}

export interface MessageSent {
  type: ActionTypes.MESSAGE_SENT;
  payload: {
    clientId: string;
    recipient: string;
  };
}

export interface GetFriendRequests {
  type: ActionTypes.GET_FRIEND_REQUESTS;
  payload: {
    friendRequests: Array<FriendRequestState>;
  };
}

export interface AcceptFriendRequest {
  type: ActionTypes.ACCEPT_FRIEND_REQUEST;
  payload: {
    id: string;
    sender: string;
    status: "confirmed";
    recipient: string;
  };
}
export interface DenyFriendRequest {
  type: ActionTypes.DENY_FRIEND_REQUEST;
  payload: {
    friendRequest: FriendRequestState;
  };
}

export type Action =
  | LoadingUser
  | Login
  | MessageRecieved
  | Signout
  | GetUser
  | GetFriends
  | LoadingFriend
  | GetFriend
  | SendFriendRequest
  | GetMessages
  | SetDummyMessages
  | SendMessage
  | MessageSent
  | ResetFetchMessages
  | Logout
  | GetFriendRequests
  | DenyFriendRequest
  | AcceptFriendRequest;
