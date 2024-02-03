import { axios } from "axios";
async function signUpService(firstName, lastName, email, password) {
  try {
    const signUpObj = {
      username: email,
      firstname: firstName,
      lastname: lastName,
      password: password,
    };
    const response = await axios.post(
      "localhost:3000/api/v1/user/signup",
      signUpObj
    );
    if (!response) {
      return response.data;
    }
  } catch (err) {
    console.log(err);
    return {};
  }
}

async function signInService(email, password) {
  const signInObj = {
    username: email,
    password: password,
  };
  try {
    const response = await axios.post(
      "localhost:3000/api/v1/user/signin",
      signInObj
    );
    if (!response) {
      return response.data;
    }
    return {};
  } catch (err) {
    console.log(err);
    return {};
  }
}
