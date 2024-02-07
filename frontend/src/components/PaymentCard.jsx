import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

async function transferFunds(user, amount, userDetails, setTxnDone) {
  const transferPaylaod = {
    to: user["_id"],
    amount: amount,
  };
  const response = await axios.post(
    "http://localhost:3000/api/v1/account/transfer",
    transferPaylaod,
    {
      headers: {
        Authorization: "Bearer " + userDetails.token,
      },
    }
  );
  if (
    response != null &&
    response.data != null &&
    response.data.message == "Transfer successful"
  ) {
    setTxnDone(true);
  }
}

export const PaymentCard = ({ user, userDetails, setTxnDone }) => {
  const [amount, setAmount] = useState(0);
  return (
    <div className="bg-background_gray h-screen flex items-center justify-center">
      <div className="rounded-md shadow-md grid grid-cols-1 bg-white p-5 w-1/4 h-1/3">
        <div className="font-bold text-2xl text-center mb-9">Send Money</div>
        <div className="flex mx-4">
          <div className="relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-payment_green rounded-full">
            <span className="font-medium text-white">
              {user.firstName != ""
                ? user?.firstName[0]?.toUpperCase() +
                  user?.lastName[0]?.toUpperCase()
                : ""}
            </span>
          </div>
          <div>
            <div className="mx-2 font-bold text-lg">
              {user?.firstName + " " + user?.lastName}
            </div>
          </div>
        </div>
        <div className="mx-4">Amount (in Rs)</div>
        <div className="mx-4">
          <form>
            <div>
              <input
                type="text"
                className="w-full h-6 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white-50"
                placeholder="Enter amount"
                required
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
            </div>
          </form>
        </div>
        <div className="mx-4">
          <button
            type="button"
            className="text-btn_white bg-payment_green hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-2"
            onClick={() => {
              transferFunds(user, amount, userDetails, setTxnDone);
            }}
          >
            {"Initiate Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
};
