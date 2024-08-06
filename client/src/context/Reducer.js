const Reducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        token: null,
        isFetching: true,
        error: false
      }
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        isFetching: false,
        error: false
      }
    case 'LOGIN_FAILURE':
      return {
        user: null,
        token: null,
        isFetching: false,
        error: true
      }
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isFetching: false,
        error: false
      }
    case 'UPDATE_START':
      return {
        ...state,
        isFetching: true
      }
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false
      }
    case 'UPDATE_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: true
      }
    default:
      return state
  }
}

export default Reducer