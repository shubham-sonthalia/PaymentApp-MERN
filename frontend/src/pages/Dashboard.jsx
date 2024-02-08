import { TopBar } from "../components/TopBar";
import { useState, useEffect } from "react";
import axios from "axios";
import UserList from "../components/UserList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export const Dashboard = () => {
  const [paymentCard, setPaymentCard] = useState(null);
  const [txnDone, setTxnDone] = useState(false);
  useEffect(() => {
    if (txnDone == true) {
      setPaymentCard(null);
      toast.success("Transfer successful");
      setTxnDone(false);
    }
  }, [txnDone]);
  const user = JSON.parse(localStorage.getItem("user"));
  const balance = useGetBalance(user);
  if (paymentCard == null) {
    return (
      <div className="">
        <TopBar></TopBar>
        <div className="font-bold m-4">
          Your Balance Rs. {parseInt(balance)}
        </div>
        <div className="m-4">
          <UserList setPaymentCard={setPaymentCard} setTxnDone={setTxnDone} />
        </div>
        <ToastContainer />
      </div>
    );
  } else {
    return paymentCard;
  }
};
