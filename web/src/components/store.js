import { createStore } from 'redux'
import io from "socket.io-client";
const initialState = {
    socket : io('https://isolation-app.herokuapp.com/')
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store