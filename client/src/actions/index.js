import axios from "axios";
//var ls = require('local-storage');

export const USER_LOGIN = "LOGIN_USER";
export const GET_ALL_USERS = "GET_ALL_USERS";
export const ONLINE_USER_ERROR = "ONLINE_USER_ERROR";
export const GET_ALL_COHORTES = "GET_ALL_COHORTES";

export function userLogIn(body) {
  return function (dispatch) {
    return axios.post("http://localhost:4000/login",body)
      .then((result) => result.data)
      .then((data) => {
        dispatch({
          type: USER_LOGIN,
          payload: data == false ? 0 : data 
        });
      });
  };
}
export function onlineUserError() {
  return {
    type: ONLINE_USER_ERROR,
  };
}

export function getAllUsers() {
  return function (dispatch) {
    return axios
      .get("http://localhost:4000/users")
      .then((result) => result.data)
      .then((data) => {
        dispatch({
          type: GET_ALL_USERS,
          payload: data,
        });
      });
  };
}

export function getAllCohortes() {
  return function (dispatch) {
    return axios
      .get("http://localhost:4000/cohorte")
      .then((result) => result.data)
      .then((data) => {
        dispatch({
          type: GET_ALL_COHORTES,
          payload: data,
        });
      });
  };
}
