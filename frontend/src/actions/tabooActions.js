import Axios from "axios";
import {
  ADD_TABOO_WORD_REQUEST,
  ADD_TABOO_WORD_SUCCESS,
  ADD_TABOO_WORD_FAIL,
  GET_TABOO_WORDS_REQUEST,
  GET_TABOO_WORDS_SUCCESS,
  GET_TABOO_WORDS_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  GET_DISCISSION_REQUEST,
  GET_DISCISSION_SUCCESS,
  GET_DISCISSION_FAIL,
  DELETE_TABOO_WORD_REQUEST,
  DELETE_TABOO_WORD_SUCCESS,
  DELETE_TABOO_WORD_FAIL
} from "../constants/tabooConstants";

export const addTaboo = (word) => async (dispatch, getState) => {
  dispatch({ type: ADD_TABOO_WORD_REQUEST, payload: { word } });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      "/api/taboo",
      {
        word,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: ADD_TABOO_WORD_SUCCESS, payload: data });
    dispatch(getTabooWords());
  } catch (error) {
    dispatch({
      type: ADD_TABOO_WORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getTabooWords = () => async (dispatch, getState) => {
  dispatch({ type: GET_TABOO_WORDS_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/taboo", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: GET_TABOO_WORDS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_TABOO_WORDS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteTabooWord = (_id) => async (dispatch, getState) => {
  dispatch({ type: DELETE_TABOO_WORD_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.delete(`/api/taboo/${_id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: DELETE_TABOO_WORD_SUCCESS, payload: data });
    dispatch(getTabooWords());
  } catch (error) {
    dispatch({
      type: DELETE_TABOO_WORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const sendMessage = (message) => async (dispatch, getState) => {
  dispatch({ type: SEND_MESSAGE_REQUEST, payload: { message } });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      "/api/discussion",
      {
        message,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: data });
    dispatch(getDiscussion());
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getDiscussion = () => async (dispatch) => {
  dispatch({ type: GET_DISCISSION_REQUEST });
  try {
    const { data } = await Axios.get("/api/discussion");
    dispatch({ type: GET_DISCISSION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_DISCISSION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
