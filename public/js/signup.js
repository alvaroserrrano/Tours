/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
export const signup = async (name, email, password, passwordConfirm, role) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        role
      }
    });
    console.log(res.data);
    if (password !== passwordConfirm)
      showAlert('error', 'Passwords do not match');

    if (res.data.status === 'success') {
      showAlert('success', 'Registered successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.data.message);
  }
};
