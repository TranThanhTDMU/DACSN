import * as Actions from './constant'

const reducer = (state, action) => {
  switch (action.type) {
    case Actions.GET_USER: {
      const login = localStorage.getItem('login')
      const firstName = localStorage.getItem('firstName')
      const lastName = localStorage.getItem('lastName')
      const image = localStorage.getItem('image')
      const role = localStorage.getItem('role')
      const id = localStorage.getItem('id')

      return {
        ...state,
        login,
        user: {
          id,
          firstName,
          lastName,
          image,
          role
        }
      }
    }

    case Actions.TOGGLE_LOADING: {
      return {
        ...state,
        loading: action.payload
      }
    }

    

    default: return state
  }

  
}

export default reducer