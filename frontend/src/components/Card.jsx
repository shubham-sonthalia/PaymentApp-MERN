import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

async function signUpService(
  firstName,
  lastName,
  email,
  password,
  setUser,
  setFirstName,
  setLastName,
  setEmail,
  setPassword
) {
  try {
    const signUpObj = {
      username: email,
      firstname: firstName,
      lastname: lastName,
      password: password,
    };
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signup",
      signUpObj
    );
    if (response) {
      setUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
        token: response.data.token,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          token: response.data.token,
        })
      );
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function signInService(email, password, setUser, setEmail, setPassword) {
  const signInObj = {
    username: email,
    password: password,
  };
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signin",
      signInObj
    );
    if (response) {
      setUser({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: email,
        token: response.data.token,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: email,
          token: response.data.token,
        })
      );
      setEmail("");
      setPassword("");
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export const Card = ({ signIn, message, setUser }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSignUpAndSignIn();
    }
  };
  const handleSignUpAndSignIn = async () => {
    let res = false;
    if (signIn == true) {
      res = await signInService(
        email,
        password,
        setUser,
        setEmail,
        setPassword
      );
    } else {
      res = await signUpService(
        firstName,
        lastName,
        email,
        password,
        setUser,
        setFirstName,
        setLastName,
        setEmail,
        setPassword
      );
    }
    if (res == true) {
      navigate("/dashboard");
    }
  };
  return (
    <div className="rounded-lg shadow-md grid grid-cols-1 bg-white p-3">
      <div className="grid grid-rows-2">
        <div className="flex justify-center font-semibold text-2xl">
          {signIn == true ? <div>Sign In</div> : <div>Sign Up</div>}
        </div>
        <div className="flex justify-center text-sec_text_gray mb-3">
          {message}
        </div>
      </div>
      <div className="justify-center font-semibold">
        {signIn == false ? (
          <form>
            <div className="mb-6">
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-form_label_text_black"
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                className="border_gray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="John"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-form_label_text_black"
              >
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                value={lastName}
                className="border_gray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Doe"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                required
              />
            </div>
          </form>
        ) : null}
      </div>
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-form_label_text_black"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          className="border_border_gray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="john.doe@company.com"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-form_label_text_black"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          className="border_border_gray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="•••••••••"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          required
        />
      </div>
      <button
        type="button"
        className="text-btn_white bg-black hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        onClick={async () => handleSignUpAndSignIn}
      >
        {signIn == true ? "Sign In" : "Sign Up"}
      </button>
      <div>
        {signIn == false ? (
          <div className="flex justify-center text-login_ask_text_black">
            <div className="mr-2">Already have an account?</div>
            <Link to="/signin">
              <button className="underline font-semibold">Login</button>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};
