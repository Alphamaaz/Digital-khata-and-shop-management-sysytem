// src/components/Bill.js
import React from "react";
import "../styles/Bill.css"; // Optional: custom print styles

const Bill = ({ items, quantities, amountPaid }) => {
  const totalAmount = items.reduce((acc, item) => {
    const qty = quantities[item._id] || 1;
    return acc + qty * item.sellPrice;
  }, 0);

  const remaining = totalAmount - amountPaid;

  return (
    <div className="bill-container">
      <h2>Customer Receipt</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const qty = quantities[item._id] || 1;
            return (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{qty}</td>
                <td>{item.sellPrice}</td>
                <td>{qty * item.sellPrice}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="bill-summary">
        <p>Total Amount: Rs {totalAmount}</p>
        <p>Amount Paid: Rs {amountPaid}</p>
        <p>
          Remaining:{" "}
          <span style={{ color: remaining <= 0 ? "green" : "red" }}>
            Rs {remaining}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Bill;
