import { ActionTypes } from "../action-types";
import { Dispatch } from "redux";
import { Login, Action } from "../actions";
import { storeData, deleteData } from "../../util";
import axios from "axios";
import { socketService } from "../../../App";
import { ChatData } from "../../socket-service";

const BASE_URL = "https://new-chatty-backend.herokuapp.com";

export const signin = (email: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionTypes.LOADING_USER,
      payload: {
        loading: true,
      },
    });
    try {
      const {
        data,
      } = await axios.post(
        "https://new-chatty-backend.herokuapp.com/api/auth/signin",
        { email, password }
      );
      console.log(data);
      if (data.token) {
        axios.defaults.headers.Authorization = `Bearer ${data.token}`;
        await storeData("token", data.token);
        const { email, id, firstName, friends, lastName } = data.user;
        dispatch({
          type: ActionTypes.LOG_IN,
          payload: {
            email,
            id,
            firstName,
            friends,
            lastName,
            token: data.token,
          },
        });
      }
    } catch (e) {
      //TODO implement error handling
      console.log(e);
    }
  };
};

export const signup = (
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string
) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionTypes.LOADING_USER,
      payload: {
        loading: true,
      },
    });
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/signup`, {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      });
      console.log("THIS IS THE DATA FOR SIGNUP");
      console.log(data);
      if (data.token) {
        axios.defaults.headers.Authorization = `Bearer ${data.token}`;
        await storeData("token", data.token);
        const { email, id, firstName, friends, lastName } = data.user;
        dispatch({
          type: ActionTypes.LOG_IN,
          payload: {
            token: data.token,
            email,
            id,
            firstName,
            friends,
            lastName,
          },
        });
      }
    } catch (e) {
      //TODO implement error handling
      console.log(e);
    }
  };
};

export const getUser = (token: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.LOADING_USER, payload: { loading: true } });
    try {
      const { data } = await axios.get(
        "https://new-chatty-backend.herokuapp.com/api/auth/currentuser"
      );
      if (data.email) {
        dispatch({
          type: ActionTypes.LOG_IN,
          payload: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            friends: data.friends,
            id: data.id || data._id,
            token: token,
          },
        });
      }
    } catch (e) {
      console.log(e);
      console.log(e.response.status);
      await deleteData("token");
      dispatch({
        type: ActionTypes.LOG_OUT,
        payload: undefined,
      });
    }
  };
};

export const logout = () => {
  (async () => {
    await deleteData("token");
  })();
  return {
    type: ActionTypes.LOG_OUT,
    payload: undefined,
  };
};

export const getFriends = (friends: string[]) => {
  console.log("getting friends");
  console.log(friends);
  return async (dispatch: Dispatch<Action>) => {
    friends.forEach(async (friend) => {
      dispatch({
        type: ActionTypes.LOADING_FRIEND,
        payload: {
          email: friend,
        },
      });
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/friend/user/${friend}`
        );
        console.log("this is data from getting friend");
        console.log(data);
        if (data.friend) {
          dispatch({
            type: ActionTypes.GET_FRIEND,
            payload: {
              email: data.friend.email,
              firstName: data.friend.firstName,
              lastName: data.friend.lastName,
            },
          });
        }
      } catch (e) {
        console.log("error");
        console.log(e);
      }
    });
  };
};

export const addFriend = (email: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/friend/send-friend-request/${email}`
      );
      console.log(data);
      if (data.sender) {
        dispatch({
          type: ActionTypes.SEND_FRIEND_REQUEST,
          payload: {
            id: data.id,
            recipient: data.recipient,
            sender: data.sender,
            status: data.status,
          },
        });
        return true;
      }
    } catch (e) {
      //TODO implement proper error handling
      console.log(e);
      return false;
    }
  };
};

export const SetDummyMessages = (friendEmail: string, userEmail: string) => {
  const messages: Array<ChatData> = [];
  const message1: ChatData = {
    recipient: friendEmail,
    sender: userEmail,
    content: "yo how's it going",
    created_at: new Date().toISOString(),
    status: "sent",
  };
  const message2: ChatData = {
    recipient: userEmail,
    sender: friendEmail,
    content: "Good, how about you?",
    created_at: new Date().toISOString(),
    status: "sent",
  };
  const message3: ChatData = {
    recipient: friendEmail,
    sender: userEmail,
    content: "not so bad",
    created_at: new Date().toISOString(),
    status: "sent",
  };
  messages.push(message1);
  messages.push(message2);
  messages.push(message3);
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionTypes.SET_DUMMY_MESSAGES,
      payload: {
        friendEmail: friendEmail,
        messages: messages,
      },
    });
  };
};

export const sendMessage = (msg: ChatData) => {
  const { content, recipient, sender, clientId } = msg;

  return async (dispatch: Dispatch<Action>) => {
    const didSubmit = socketService.postMessage(msg);
    if (didSubmit) {
      dispatch({
        type: ActionTypes.SEND_MESSAGE,
        payload: {
          content,
          sender,
          recipient,
          created_at: new Date().toUTCString(),
          clientId: clientId || "",
        },
      });
    }
  };
};

export const getMessages = (friendEmail: string) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/messages/${friendEmail}`
      );
      console.log("these are messages gotte ");
      console.log(data);
      if (data.length) {
        dispatch({
          type: ActionTypes.GET_MESSAGES,
          payload: {
            messages: data,
            friendEmail,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const resetMessageFetch = () => {
  return {
    type: ActionTypes.RESET_FETCH_MESSAGE,
    payload: undefined,
  };
};

export const getFriendRequests = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/friend/friend-requests`
      );
      if (data) {
        dispatch({
          type: ActionTypes.GET_FRIEND_REQUESTS,
          payload: {
            friendRequests: data,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const acceptOrDenyFriendRequest = (
  id: string,
  action: "accept" | "deny"
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/friend/action-friend-request/${id}`,
        {
          action,
        }
      );
      if (data) {
        if (action === "accept") {
          dispatch({
            type: ActionTypes.ACCEPT_FRIEND_REQUEST,
            payload: {
              id: data.id,
              recipient: data.recipient,
              sender: data.sender,
              status: data.status,
            },
          });
        } else {
          //deny
          dispatch({
            type: ActionTypes.DENY_FRIEND_REQUEST,
            payload: {
              friendRequest: data,
            },
          });
        }
        return data.sender;
      }
    } catch (e) {}
  };
};

export const actionCreators = {
  signin,
  getUser,
  getFriends,
  signup,
  addFriend,
  SetDummyMessages,
  sendMessage,
  getMessages,
  resetMessageFetch,
  logout,
  getFriendRequests,
  acceptOrDenyFriendRequest,
};
