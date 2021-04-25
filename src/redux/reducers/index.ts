import { combineReducers } from "redux";
import userReducer from "./user-reducer";
import dataReducer from "./data-reducer";

const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
