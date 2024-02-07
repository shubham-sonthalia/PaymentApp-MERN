import { useState, useEffect } from "react";
import axios from "axios";
import { PaymentCard } from "./PaymentCard";

function useDebouncedText(text) {
  const [debouncedText, setDebouncedText] = useState(text);
  useEffect(() => {
    const val = setInterval(() => {
      setDebouncedText(text);
    }, 1000);
    return () => {
      clearInterval(val);
    };
  }, [text]);
  return debouncedText;
}
function useGetUserList(debouncedText, setLoading, user) {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/bulk?filter=" + debouncedText)
      .then((response) => {
        if (
          response != null &&
          response.data != null &&
          response.data.users != null
        ) {
          response.data.users = response.data.users.filter((x) => {
            return x["userName"] != user.email;
          });
          setUserList(response.data.users);
          setLoading(false);
        }
      });
  }, [debouncedText]);
  return userList;
}
const UserList = ({ setPaymentCard, setTxnDone }) => {
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const debouncedText = useDebouncedText(filterText);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const users = useGetUserList(debouncedText, setLoading, userDetails);
  if (loading) {
    return (
      <div>
        <div>Users</div>
        <div>Loading...</div>
      </div>
    );
  }
  return (
    <div>
      <div className="m-2 font-bold">Users</div>
      <div className="m-4">
        <form>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="w-full h-6 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white-50"
              placeholder="Search users..."
              required
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
              }}
            />
          </div>
        </form>
      </div>
      <div className="my-8">
        {users?.map((user) => (
          <Users
            key={user._id}
            user={user}
            setPaymentCard={setPaymentCard}
            userDetails={userDetails}
            setTxnDone={setTxnDone}
          ></Users>
        ))}
      </div>
    </div>
  );
};

function Users({ user, setPaymentCard, userDetails, setTxnDone }) {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {user.firstName != ""
              ? user?.firstName[0]?.toUpperCase() +
                user?.lastName[0]?.toUpperCase()
              : ""}
          </span>
        </div>
        <div className="mx-2">{user?.firstName + " " + user?.lastName}</div>
      </div>
      <div>
        <button
          className="text-btn_white bg-black hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={() => {
            setPaymentCard(
              <PaymentCard
                user={user}
                userDetails={userDetails}
                setTxnDone={setTxnDone}
              ></PaymentCard>
            );
          }}
        >
          Send Money
        </button>
      </div>
    </div>
  );
}
export default UserList;
