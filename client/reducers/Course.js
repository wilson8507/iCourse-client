import {
  CLEAR_STATE,
  GET_COURSE_LIST,
} from '../actions/Course.js';

export default (state = {
  courseList: [],
}, action) => {
  switch (action.type) {
    case CLEAR_STATE: {
      return {
        ...state,
        courseList: [],
      };
    }
    case GET_COURSE_LIST: {
      return {
        ...state,
        courseList: action.list,
      };
    }
    default:
      return state;
  }
};