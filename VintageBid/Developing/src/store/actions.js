import * as Actions from './constant'

export const getUser = (payload) => ({
  type: Actions.GET_USER,
  payload
})

export const toggleLoading = (payload) => ({
  type: Actions.TOGGLE_LOADING,
  payload
})