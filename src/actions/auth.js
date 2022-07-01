/* eslint-disable consistent-return */
import { AUTHENTICATED, NOT_AUTHENTICATED } from '.';

const setToken = (token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('lastLoginTime', new Date(Date.now()).getTime());
};

const getToken = () => {
  const now = new Date(Date.now()).getTime();
  const thirtyMinutes = 1000 * 60 * 30;
  const timeSinceLastLogin = now - localStorage.getItem('lastLoginTime');
  if (timeSinceLastLogin < thirtyMinutes) {
    return localStorage.getItem('token');
  }
};

export const checkAuth = () => (dispatch) =>
  fetch('https://backend-dejan-rentacar.herokuapp.com/current_user', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getToken(),
    },
  }).then(async (data) => {
    if (data.ok) {
      const user = await data.json();
      return dispatch({ type: AUTHENTICATED, payload: user });
    }
    return Promise.reject(dispatch({ type: NOT_AUTHENTICATED }));
  });



export const signupUser = (user) => (dispatch) =>
  fetch('https://backend-dejan-rentacar.herokuapp.com/signup', {
    method: 'POST',
    body: user,
  }).then((res) => {
    if (res.ok) {
      setToken(res.get('Authorization'));
      return res
        .json()
        .then((userJson) =>
          dispatch({ type: AUTHENTICATED, payload: userJson.data })
        );
    }
    return res.json().then((errors) => {
      dispatch({ type: NOT_AUTHENTICATED });
      return Promise.reject(errors);
    });
  });

export const loginUser = (user) => (dispatch) =>
  fetch('https://backend-dejan-rentacar.herokuapp.com/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user }),
  }).then((response) => {
    if (response.ok) {
      setToken(response.headers.get('Authorization'));
      return response
        .json()
        .then((userJson) =>
          dispatch({ type: AUTHENTICATED, payload: userJson.data })
        );
    }
    return response.json().then((errors) => {
      dispatch({ type: NOT_AUTHENTICATED });
      return Promise.reject(errors);
    });
  });

export const logoutUser = () => (dispatch) =>
  fetch('https://backend-dejan-rentacar.herokuapp.com/logout', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getToken(),
    },
  }).then((res) => {
    if (res.ok) {
      return dispatch({ type: NOT_AUTHENTICATED });
    }
    return res.json().then((errors) => {
      dispatch({ type: NOT_AUTHENTICATED });
      return Promise.reject(errors);
    });
  });
