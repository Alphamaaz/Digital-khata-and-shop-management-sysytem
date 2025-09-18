import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerTransactions } from "../redux/transactionsSlice";
import "../styles/transactions.css"; // Import custom CSS

const Transactions = ({ customerId }) => {
  const dispatch = useDispatch();
  const { transactions, customer, status, error } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerTransactions(customerId));
    }
  }, [customerId, dispatch]);

  if (status === "loading") return <p>Loading transactions...</p>;
  if (status === "failed") return <p className="error">{error}</p>;
  if (!Array.isArray(transactions)) return <p>No transactions found.</p>;

  return (
    <div className="transactions-container">
      {customer && (
        <div className="customer-info">
          <img
            src={customer.profilePicture}
            alt={customer.name}
            className="profile-pic"
          />
          <h2>{customer.name}</h2>
          <p>Total Debt: Rs {customer.totalDebt}</p>
        </div>
      )}

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        transactions.map((transaction) => (
          <div
            key={transaction._id}
            className={`transaction-card ${transaction.type}`}
          >
            <p>
              <strong>{transaction.type.toUpperCase()}</strong>: Rs{" "}
              {transaction.totalAmount || transaction.amountPaid}
            </p>
            {transaction.type === "purchase" && (
              <ul>
                {transaction.products.map((product) => (
                  <li key={product._id}>
                    {product.name} - {product.quantity} x Rs {product.price}
                  </li>
                ))}
              </ul>
            )}
            <p>Date: {new Date(transaction.date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Transactions;
