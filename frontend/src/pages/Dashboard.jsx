import { TopBar } from "../components/TopBar";
import { useState, useEffect } from "react";
import axios from "axios";
import UserList from "../components/userList";

function useGetBalance(user) {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      })
      .then((response) => {
        setBalance(response.data.balance);
      });
  }, []);
  return balance;
}
export const Dashboard = ({ user }) => {
  const [paymentCard, setPaymentCard] = useState(null);
  console.log(user);
  const balance = useGetBalance(user);
  if (paymentCard == null) {
    return (
      <div className="">
        <TopBar user={user}></TopBar>
        <div className="font-bold m-4">Your Balance $ {parseInt(balance)}</div>
        <div className="m-4">
          <UserList setPaymentCard={setPaymentCard} />
        </div>
      </div>
    );
  } else {
    return paymentCard;
  }
};