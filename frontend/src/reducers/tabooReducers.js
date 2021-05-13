import {
  ADD_TABOO_WORD_REQUEST,
  ADD_TABOO_WORD_SUCCESS,
  ADD_TABOO_WORD_FAIL,

  GET_DISCISSION_REQUEST,
  GET_DISCISSION_SUCCESS,
  GET_DISCISSION_FAIL
} from '../constants/tabooConstants';

export const addTabooReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TABOO_WORD_REQUEST:
      return { loading: true };
    case ADD_TABOO_WORD_SUCCESS:
      return { loading: false, taboo: action.payload };
    case ADD_TABOO_WORD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const getDiscussionReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_DISCISSION_REQUEST:
      return { loading: true };
    case GET_DISCISSION_SUCCESS:
      return { loading: false, discussion: action.payload };
    case GET_DISCISSION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};