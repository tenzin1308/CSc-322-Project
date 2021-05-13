import {
  ADD_TABOO_WORD_REQUEST,
  ADD_TABOO_WORD_SUCCESS,
  ADD_TABOO_WORD_FAIL
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