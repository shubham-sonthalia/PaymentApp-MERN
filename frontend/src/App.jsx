import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Dashboard } from "./pages/dashboard";
import { Signin } from "./pages/signin";
import { Signup } from "./pages/signup";
function App() {
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    userId: "",
    token: "",
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Signup user={user} setUser={setUser}></Signup>}
        ></Route>
        <Route
          path="/dashboard"
          element={<Dashboard user={user}></Dashboard>}
        ></Route>
        <Route
          path="/signup"
          element={<Signup user={user} setUser={setUser}></Signup>}
        ></Route>
        <Route
          path="/signin"
          element={<Signin user={user} setUser={setUser}></Signin>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
