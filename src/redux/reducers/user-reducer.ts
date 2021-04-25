import { Reducer } from "redux";
import { Action } from "../actions";
import { ActionTypes } from "../action-types";
import produce from "immer";

interface UserState {
  token: string | null;
  id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  friends: string[];
  loading: boolean;
}

const initialState: UserState = {
  token: null,
  email: null,
  id: null,
  firstName: null,
  lastName: null,
  friends: [],
  loading: false,
};

const reducer: Reducer<UserState, Action> = produce(
  (state: UserState = initialState, action: Action) => {
    switch (action.type) {
      case ActionTypes.LOG_IN: {
        const {
          email,
          id,
          token,
          firstName,
          friends,
          lastName,
        } = action.payload;

        state.email = email;
        state.id = id;
        state.firstName = firstName;
        state.lastName = lastName;
        state.token = token;
        state.friends = friends;
        state.loading = false;
        return state;
      }
      case ActionTypes.LOADING_USER: {
        state.loading = true;
        return state;
      }
      case ActionTypes.LOG_OUT: {
        state = initialState;
        return state;
      }
      default:
        return state;
    }
    return state;
  }
);

export default reducer;
