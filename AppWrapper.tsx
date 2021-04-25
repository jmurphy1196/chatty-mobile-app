import React, { Component } from "react";

import App from "./App";
import { store } from "./src/redux";
import { Provider } from "react-redux";
export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
