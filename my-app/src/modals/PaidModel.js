import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DebtPaymentModal.css";
import BASE_URL from "../utils/baseUrl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCustomerTransactions } from "../redux/transactionsSlice";
import { fetchCustomers } from "../redux/customersSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../utils/languages";

const DebtPaymentModal = ({
  customerId,
  debtAmount,
  onPayment,
  onClose,
  payment,
  setSelectedEntry
        
}) => {
  const isEditing = Boolean(payment);
  const [amountReceived, setAmountReceived] = useState("");
  const [colorIntensity, setColorIntensity] = useState(150);
  const [totalDebt, setTotalDebt] = useState(debtAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const dispatch = useDispatch()
  const language = useSelector((state) => state.language.mode);
  const languages = setLanguage(language);

  useEffect(() => {
    if (isEditing && payment) {
      setAmountReceived(payment.amountPaid);
    }
  }, [isEditing, payment]);
  useEffect(() => {
    if (amountReceived) {
      const percentagePaid = (parseFloat(amountReceived) / totalDebt) * 100;
      const intensity = Math.min(150 + Math.floor(percentagePaid * 1.5), 255);
      setColorIntensity(intensity);
    } else {
      setColorIntensity(150);
    }
  }, [amountReceived, totalDebt]);
  useEffect(() => {
      if (!payment) {
        const newBillNumber = `${Date.now().toString(36).toUpperCase()}`;
        setBillNumber(newBillNumber);
      } else {
        setBillNumber(payment.billNumber || "");
      }
    }, [payment]);

 const handlePayment = async () => {
   const paymentAmount = parseFloat(amountReceived);

   if (!amountReceived || isNaN(paymentAmount)) {
     alert("Please enter a valid amount.");
     return;
   }

   if (!isEditing && paymentAmount > totalDebt) {
     toast.warn(`${languages.paymentsExeeded}`);
     return;
   }

   setIsProcessing(true);

   try {
     if (isEditing) {
       // Update existing payment
       const response = await axios.put(
         `${BASE_URL}/payments/update/${payment._id}`,
         { amountPaid: paymentAmount }
         
       );

       if (response.status === 200) {
        toast.success(response.data.message);
         setTimeout(() => {
          setSelectedEntry(null)
           dispatch(fetchCustomerTransactions(customerId))
           dispatch(fetchCustomers());
           onPayment();
         }, 800);
        
         
      
       } else {
         alert("Failed to update payment.");
       }
     } else {
       // Create new payment
       const response = await axios.post(`${BASE_URL}/payments/create`, {
         customerId,
         amountPaid: paymentAmount,
         billNumber
       });

       // Accept both 200 and 201 as success
       if (response.status === 200 || response.status === 201) {
        console.log("customer id : ", customerId);
        toast.success(response.data.message)
        setTimeout(()=>{
          setSelectedEntry(null)
          dispatch(fetchCustomerTransactions(customerId))
          dispatch(fetchCustomers())
          onPayment();

        },800)
        
        
         setTotalDebt((prev) => prev - paymentAmount);
         setAmountReceived("");
        
        

       } else {
         alert("Failed to process payment.");
       }
     }
   } catch (error) {
     alert(error?.response?.data?.message || "Failed to process payment.");
   } finally {
     setIsProcessing(false);
   }
 };


  return (
    <>
      <div className="paid-modal-overlay">
        <div
          className="debt-modal"
          
        >
          <div className="modal-header">
            <h2>{isEditing ? `${languages.editPayment}` : `${languages.addPayment}`}</h2>
            <button onClick={onClose} className="close-btn">
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="debt-info">
              <p>{languages.debt}: Rs {totalDebt}</p>
              <p>
                 {isEditing ? `${languages.paid}` : `${languages.received}`}: Rs{" "}
                {amountReceived || 0}
              </p>
              <p>
                {languages.remaining}: Rs{" "}
                {(totalDebt - (parseFloat(amountReceived) || 0)).toFixed(2)}
              </p>
            </div>

            <input
              type="number"
              value={amountReceived}
              onChange={(e) => {
                const raw = e.target.value;

                // Allow empty input
                if (raw === "") {
                  setAmountReceived("");
                  return;
                }

                // Allow only valid numbers
                if (!/^\d*\.?\d*$/.test(raw)) return;

                setAmountReceived(raw);
              }}
              placeholder={languages.enterAmount}
              className="payment-input"
              disabled={isProcessing}
            />

            <button
              onClick={handlePayment}
              className="payment-button"
              disabled={!amountReceived || isProcessing}
            >
              {isProcessing
                ? isEditing
                  ? "Updating..."
                  : "Processing..."
                : isEditing
                ? "Update Payment"
                : `${languages.receivedPayment}`}
            </button>

            {totalDebt <= 0 && !isEditing && (
              <div className="success-message">Debt Fully Cleared! ✔️</div>
            )}
          </div>
        </div>
        <ToastContainer/>
      </div>

      
    </>
  );
};

export default DebtPaymentModal;
