// Receipt.js
import React from "react";
import "../styles/Receipt.css";

const Receipt = ({
  receiptId,
  customerName,
  date,
  items,
  amountPaid,
  totalAmount,
  remainingBalance,
  type, // 'purchase' or 'payment'
}) => {
  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <h2>Digital Khata</h2>
        <p>
          <strong>Receipt ID:</strong> {receiptId}
        </p>
        <p>
          <strong>Date:</strong> {new Date(date).toLocaleString()}
        </p>
        <p>
          <strong>Customer:</strong> {customerName}
        </p>
      </div>

      <div className="receipt-body">
        {type === "purchase" && (
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>Rs {item.price}</td>
                  <td>Rs {item.quantity * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {type === "payment" && (
          <p className="payment-info">Payment Received: Rs {amountPaid}</p>
        )}
      </div>

      <div className="receipt-footer">
        <p>
          <strong>Total:</strong> Rs {totalAmount}
        </p>
        <p>
          <strong>Paid:</strong> Rs {amountPaid}
        </p>
        <p>
          <strong>Remaining:</strong> Rs {remainingBalance}
        </p>
      </div>
    </div>
  );
};

export default Receipt;
