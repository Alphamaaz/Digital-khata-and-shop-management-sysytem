import React, { useEffect, useState, useCallback, useMemo } from "react";
import "../styles/Entry.css";
import Modal from "react-modal";
import Image from "../images/cross-small (1).png";
import Delete from "../images/trash (1).png";
import Edit from "../images/pencil.png";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../utils/languages";
import axios from "axios";
import BASE_URL from "../utils/baseUrl";
import {
  deletePurchase,
} from "../redux/purchasesSlice";

import AddItemModal from "../modals/ItemModal";
import DebtPaymentModal from "../modals/PaidModel";
import { fetchCustomers } from "../redux/customersSlice";
import { fetchCustomerTransactions } from "../redux/transactionsSlice";

const EntryDetails = ({
  type,
  setSelectedEntry,
  setRemoveClass,
  purchaseId,
  customerID,
  totalDebt,
}) => {
  Modal.setAppElement("#root");

  const theme = useSelector((state) => state.theme.mode);
  const language = useSelector((state) => state.language.mode);
  const [loading, setLoading] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [purchase, setPurchase] = useState("");
  const [editing, setEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [payment, setPayment] = useState({});
  const languages = useMemo(() => setLanguage(language), [language]);

  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setPurchase(null);
    setRemoveClass(false);
    setSelectedEntry(null);
  }, [setRemoveClass, setSelectedEntry]);

  const formatAmount = useCallback(
    (amount) => amount.toLocaleString("en-US"),
    []
  );

  const handleDelete = useCallback(
    async (Id) => {
      try {
        if (!Id || typeof Id !== "string") {
          console.error("Invalid ID:", Id);
          alert("Invalid ID, please refresh and try again.");
          return;
        }

        if (type === "purchase") {
          await dispatch(deletePurchase(Id)).unwrap();
          openModal();
          setTimeout(() => {
            dispatch(fetchCustomerTransactions(customerID));
            dispatch(fetchCustomers());
          }, 1000);
        } else if (type === "payment") {
          await axios.delete(`${BASE_URL}/payments/delete/${Id}`);
          openModal();
          setTimeout(() => {
            dispatch(fetchCustomerTransactions(customerID));
            dispatch(fetchCustomers());
          }, 1000);
        } else {
          console.warn("Invalid type. Must be 'purchase' or 'payment'.");
        }
      } catch (error) {
        console.error("Error deleting:", error);
        alert(error?.message || "Failed to delete. Please try again.");
      }
    },
    [dispatch, customerID, openModal, type]
  );

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (!purchaseId) return;

      try {
        setLoading(true);
        if (type === "purchase") {
          const response = await axios.get(
            `${BASE_URL}/purchases/${purchaseId}`
          );
          setPurchase(response.data || null);
        } else if (type === "payment") {
          const response = await axios.get(
            `${BASE_URL}/payments/${purchaseId}`
          );
          setPayment(response.data || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPurchase(null);
        setPayment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [purchaseId, type, totalDebt]);

  const handleEditPurchase = useCallback(() => {
    if (type === "payment") {
      setShowDebtModal(true);
    } else {
      setEditing(true);
      setItemModalOpen(true);
    }
  }, [type]);
  return (
    <div className="entry-details-card">
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>{languages.deletePurchase}</h3>
            <p>{languages.confitmDel}</p>
            <div className="modal-actions">
              <button
                className="confirm-btn delete-btn"
                onClick={() => handleDelete(purchaseId)}
              >
                {languages.delete}
              </button>
              <button
                className="btn cancel-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                {languages.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-body">
          <h2>{languages.purchaseDeleted}</h2>
          <p>{languages.purchaseDeleteds}</p>
          <button onClick={closeModal} className="close-btn">
            {languages.ok}
          </button>
        </div>
      </Modal>

      <div className="entry-header">
        <img
          src={Image}
          alt="icon"
          className="entry-icon"
          style={{
            filter: `${theme === "dark" ? "brightness(0) invert(1)" : ""}`,
          }}
          onClick={() => {
            setSelectedEntry(null);
            setRemoveClass(null);
          }}
        />
        <h1>{languages.entryDetails}</h1>
      </div>

      <div className="entry-body">
        <div className="bill-id">
          <p>{languages.billNumber}: </p>
          <span>
            {new Date(
              type === "purchase" ? purchase.purchaseDate : payment.paymentDate
            ).toLocaleString()}
          </span>
        </div>

        {type === "purchase" ? (
          <>
            <table className="entry-table">
              <thead>
                <tr>
                  <th>{languages.item}</th>
                  <th>{languages.qty}</th>
                  <th>{languages.rate}</th>
                  <th>{languages.amount}</th>
                </tr>
              </thead>
              <tbody>
                {purchase ? (
                  purchase.products.map((product, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "table-row" : "table-row-alt"
                      }
                    >
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                      <td>{`Rs ${formatAmount(
                        product.quantity * product.price
                      )}`}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">
                      {languages.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="amounts">
              <div className="total-amount">
                <span>{languages.totalPurchase}</span>
                {purchase.totalAmount}
              </div>
              <div className="paid-amount">
                <span>{languages.paid}</span>
                {purchase.amountPaid}
              </div>
              <div className="remaining-amount">
                <span>{languages.remaining}</span>
                <h2
                  style={{
                    color: purchase.remainingBalance === 0 ? "green" : "red",
                  }}
                >
                  {purchase.remainingBalance}
                </h2>
              </div>
            </div>
          </>
        ) : (
          <div className="payments">
          <strong>{languages.amountPaid}</strong>
            <strong>Rs {payment.amountPaid}</strong>
          </div>
        )}
      </div>

      <AddItemModal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        purchaseData={purchase}
        isEditing={editing}
        customerId={customerID}
        setSelectedEntry={setSelectedEntry}
        
      />

      {showDebtModal && (
        <DebtPaymentModal
          customerId={customerID}
          debtAmount={totalDebt}
          payment={payment}
          onPayment={() => setShowDebtModal(false)}
          onClose={() => setShowDebtModal(false)}
          setSelectedEntry={setSelectedEntry}
         
        />
      )}

      <div className="action-buttons">
        <button
          className="edit-btn"
          onClick={handleEditPurchase}
          style={{
            fontSize: language === "urdu" ? "18px" : "large",
            fontWeight: language === "urdu" ? "bold" : "500",
          }}
        >
          <img
            src={Edit}
            alt="edit"
            style={{
              marginRight: language === "urdu" ? "0px" : "10px",
              marginLeft: language === "urdu" ? "10px" : "0px",
            }}
          />
          {languages.editEntry}
        </button>

        <button
          className="delete-btn"
          onClick={() => setShowConfirmModal(true)}
          style={{
            fontSize: language === "urdu" ? "18px" : "large",
            fontWeight: language === "urdu" ? "bold" : "500",
          }}
        >
          <img
            src={Delete}
            alt="delete"
            style={{
              marginRight: language === "urdu" ? "0px" : "10px",
              marginLeft: language === "urdu" ? "10px" : "0px",
            }}
          />
          {languages.deleteEntry}
        </button>
      </div>
    </div>
  );
};

export default EntryDetails;
