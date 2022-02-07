const INITIAL_STATE = {
    parentList: [],
    count: 0,
    error: null,
    fetching: false,
    fetched: false
  }
  
  export default function reducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'GET_PARENTS_PENDING':
      case 'ADD_PARENT_PENDING':
      case 'SAVE_PARENT_PENDING':
      case 'DELETE_PARENT_PENDING':
        return { ...state, error: null, fetching: true, fetched: false }
      case 'GET_PARENTS_FULFILLED':
      case 'ADD_PARENT_FULFILLED':
      case 'SAVE_PARENT_FULFILLED':
      case 'DELETE_PARENT_FULFILLED':
        return { ...state, parentList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
      case 'GET_PARENTS_REJECTED':
      case 'ADD_PARENT_REJECTED':
      case 'SAVE_PARENT_REJECTED':
      case 'DELETE_PARENT_REJECTED':
        return { ...state, parentList: [], error: action.payload, fetching: false, fetched: true }
      default:
        return state
    }
  }