import React, { useCallback, useEffect, useMemo, useState } from "react";
import Purchase from "../images/buy.png";
import "../styles/details.css";
import { getThemeStyles } from "../utils/themeStyle";
import { setLanguage } from "../utils/languages";
import { useDispatch, useSelector } from "react-redux";
import AddItemModal from "../modals/ItemModal";
import DebtPaymentModal from "../modals/PaidModel";
import CustomerModel from "../modals/CustomerModel";
import { fetchCustomerTransactions } from "../redux/transactionsSlice";
import { useParams } from "react-router-dom";
import UpdateCustomerModal from "../modals/UpdatecustomerModal";
import axios from "axios";
import BASE_URL from "../utils/baseUrl";
import { toast, ToastContainer } from "react-toastify";


const CustomerDetails = ({ customerId,onEntryClick,removeClass,setSelectedEntry,setRemoveClass }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState("");
  const [updateCustomer, setUpdateCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const language = useSelector((state) => state.language.mode);
  const theme = useSelector((state) => state.theme.mode);
  const themeStyles = getThemeStyles(theme);
  const languages = setLanguage(language);
  const dispatch = useDispatch();
  const { id } = useParams();
  // const navigate = useNavigate();

  const customer = useSelector((state) => state.transactions.customer);
  const transactions = useSelector((state) => state.transactions.transactions);
  const status = useSelector((state) => state.transactions.status);
 

  useEffect(() => {
    if (id || customerId) {
      dispatch(fetchCustomerTransactions(id || customerId));
    }
  }, [customerId, dispatch]);

// console.log(customer)
  const CloseUpdateModal = () => {
    setUpdateCustomer(false);
  };
  const formatAmount = (amount) =>{
    return amount.toLocaleString("en-US");
  }

  const searching = useMemo(() => {
  return transactions.filter((trans) =>
    trans.billNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [transactions, searchTerm]);


const clearPayments = useCallback(async () => {
  try {
    const res = await axios.put(`${BASE_URL}/customers/clear/${customerId}`);
    console.log(res.data); // Optional: log response
    toast.warn(`${languages.paymentsCleared}`)
    setTimeout(() => {
      dispatch(fetchCustomerTransactions(customerId))
      
    }, 1000);
  } catch (error) {
    console.error("Error clearing payments:", error);
  }
}, [customerId]);

    
  

  return (
    <div
      className="customer-detail"
      style={{ backgroundColor: themeStyles.backgroundColor }}
    >
      {status === "loading" ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p className="loading-message">⏳ Loading customer details...</p>
        </div>
      ) : (
        <>
          <div
            className="customer-detail-header"
            style={{ backgroundColor: themeStyles.headBgColor }}
            onClick={() => setUpdateCustomer(true)}
          >
            <div style={{ display: "flex" }}>
              <div
                className="customer-avatar"
                style={{ backgroundColor: theme === "light" ? "#f1f1f1" : "" }}
              >
                {customer?.profilePicture ? (
                  <img
                    src={customer.profilePicture}
                    alt="profile picture"
                    className="customer-image"
                  />
                ) : (
                  <div className="placeholder-avatar">
                    {customer?.name
                      ? customer.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
              </div>
              <div
                className="customer-details"
                style={{
                  margin: `0 ${language === "urdu" ? "12px" : "0"} 0 ${
                    language === "english" ? "12px" : "0"
                  }`,
                }}
              >
                <div className="customer-header">
                  <span
                    className="customers-name"
                    style={{ color: themeStyles.textColor }}
                  >
                    {customer?.name || "Unknown"}
                  </span>
                </div>
                <div
                  className="customers-timestamp"
                  style={{ color: themeStyles.textColor }}
                >
                  <span>{languages.click}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="serch"
            style={{ borderBottom: `1px solid ${themeStyles.borderColor}` }}
          >
            <div
              className="serch-bar"
              style={{
                backgroundColor: themeStyles.backgroundColor,
                border: `1px solid ${themeStyles.borderColor}`,
              }}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === "english" ? "Search ..." : " تلاش کریں..."
                }
                style={{
                  color: themeStyles.textColor,
                  backgroundColor: themeStyles.backgroundColor,
                }}
              />
            </div>

            <div
              className="balance"
              style={{ borderBottomColor: themeStyles.borderColor }}
            >
              <div className="relative group amount-got overflow-hidden">
                <div className="transition-opacity ">
                  <p>{languages.received}</p>
                  <h1>
                    {customer?.totalPayments
                      ? customer.totalPayments.toLocaleString("en-US")
                      : 0}
                  </h1>
                </div>

                {customer?.totalPayments > 0 && (
                  <button
                    // Replace with your actual function
                    onClick={clearPayments}
                    className="absolute inset-0 w-full h-full bg-red-300 text-white font-semibold hidden group-hover:flex items-center justify-center transition-opacity duration-200"
                  >
                    Clear Payments
                  </button>
                )}
              </div>

              <div className="amount-remaing">
                <p style={{ color: "red" }}>{languages.remaining}</p>
                <h1>
                  {customer?.totalDebt
                    ? customer.totalDebt.toLocaleString("en-US")
                    : "0"}
                </h1>
              </div>
            </div>
          </div>
          {transactions.length > 0 ? (
            <div
              className="transaction-list"
              style={{ backgroundColor: "--var(bg-color)" }}
            >
              {searching.length > 0 &&
                searching.map((transaction) => (
                  <div
                    key={transaction._id}
                    className={`transaction-item ${
                      activeTransaction === transaction._id
                        ? "transaction-active"
                        : ""
                    } `}
                    onClick={() => {
                      setRemoveClass(true);
                      setSelectedEntry(true);
                      setActiveTransaction(transaction._id);
                      onEntryClick(
                        transaction._id,
                        transaction.type,
                        customer.totalDebt,
                        customerId
                      );
                    }}
                  >
                    <div className="bill-header">
                      <span className="bill-id">
                        {languages.billNumber}: {transaction.billNumber}
                      </span>
                      <span className="transaction-date">
                        {new Date(transaction.date).toLocaleString()}
                      </span>
                    </div>
                    {transaction.type === "purchase" ? (
                      <div className="amounts-container">
                        <div className="amount-group">
                          <p className="amount-label">{languages.total}</p>
                          <h2 className="amount-value">
                            Rs {formatAmount(transaction.totalAmount || 0)}
                          </h2>
                        </div>
                        <div className="amount-group received">
                          <p className="amount-label">{languages.paid}</p>
                          <h2 className="amount-value">
                            Rs {formatAmount(transaction.amountPaid || 0)}
                          </h2>
                        </div>
                        <div className="amount-group remaining">
                          <p className="amount-label">{languages.remaining}</p>
                          <h2 className="amount-value">
                            Rs {formatAmount(transaction.remainingBalance || 0)}
                          </h2>
                        </div>
                      </div> // Chat-style payment layout
                    ) : (
                      <div class="payment-card">
                        <div class="payment-content">
                          <div class="payment-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div class="payment-details">
                            <p class="payment-label">Payment Received</p>
                            <p class="payment-amount">
                              {transaction.amountPaid}
                            </p>
                            <span class="payment-badge">Successfully Paid</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="Purchase-not-found">
              <img src={Purchase} alt="purchase not found" />
              <h1>Please Make A Purchase First</h1>
            </div>
          )}

          {editCustomer && <CustomerModel />}
          <AddItemModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            customerId={customerId}
            customerName={customer?.name}
            setSelectedEntry={setSelectedEntry}
          />
          {showPaymentModal && (
            <DebtPaymentModal
              debtAmount={customer.totalDebt}
              onPayment={() => setShowPaymentModal(false)}
              onClose={() => setShowPaymentModal(false)}
              customerId={customerId}
              setSelectedEntry={setSelectedEntry}
            />
          )}

          {updateCustomer && (
            <UpdateCustomerModal
              customerId={customerId}
              onClose={CloseUpdateModal}
            />
          )}
          <div className="btns-group">
            <button className="sell-btn" onClick={() => setModalOpen(true)}>
              {languages.sell}
            </button>
            <button
              className="got-btn"
              onClick={() => setShowPaymentModal(true)}
            >
              {languages.wasool}
            </button>
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default CustomerDetails;
