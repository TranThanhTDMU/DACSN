import { createContext, useReducer, useEffect } from 'react'
import reducer from './reducer'
import api from '../utils/axios'
import { io } from 'socket.io-client'
const socket = io('localhost:3999')

export const DataContext = createContext()

export const DataProvider = (props) => {
  const initialState = {
    socket,
    notif: {
      active: false,
      content: ''
    },
    user: {},
    login: false,
    cart: [],
    loading: false
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) {
      api('GET', '/auth')
        .then(res => {
          if (res.data.status) {
            
          } else {
            dispatch({
              type: "SET_LOGIN",
              payload: false
            })
          }
        })
    }
  })

  return (
    <DataContext.Provider value={{state, dispatch}}>
      {props.children}
    </DataContext.Provider>
  )

}
