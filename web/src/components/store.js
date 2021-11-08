import { createStore } from 'redux'
import io from "socket.io-client";
const initialState = {
    socket : io('localhost:3000')
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