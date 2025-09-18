import React, { useEffect, useRef, useState } from "react";
import "../styles/itemModel.css";
import { setLanguage } from "../utils/languages";
import { getThemeStyles } from "../utils/themeStyle";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../utils/baseUrl";
import { fetchCustomerTransactions } from "../redux/transactionsSlice";
import { fetchCustomers } from "../redux/customersSlice";
import { toast, ToastContainer } from "react-toastify";
import Print from "../images/printer.png";
import Logo from "../images/logo1.png";
import { useReactToPrint } from "react-to-print";
import Cross from '../images/cross-small.png'

const AddItemModal = ({
  isOpen,
  onClose,
  customerId,
  purchaseData,
  customerName,
  isEditing,
  setSelectedEntry,
  
}) => {
  const [display, setDisplay] = useState(false);
  const [shouldPrint, setShouldPrint] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [items, setItems] = useState([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [billNumber, setBillNumber] = useState("");
  const [liveStock, setLiveStock] = useState({});

  const language = useSelector((state) => state.language.mode);
  const theme = useSelector((state) => state.theme.mode);
  const languages = setLanguage(language);
  const themeStyles = getThemeStyles(theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEditing) {
      const newBillNumber = `${Date.now().toString(36).toUpperCase()}`;
      setBillNumber(newBillNumber);
    } else {
    
      setBillNumber(purchaseData.billNumber || "");
    }
  }, [isEditing]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`);
        setItems(response.data || []);
        const stockMap = {};
        response.data.forEach((item) => {
          stockMap[item._id] = item.stock;
        });
        setLiveStock(stockMap);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  if (isEditing) {
  }

  useEffect(() => {
    if (isEditing && items.length > 0 && purchaseData?.products?.length > 0) {
      const selected = purchaseData.products?.map((item) => item.productId._id);
      const quantityMap = purchaseData.products.reduce((acc, p) => {
        if (p.productId && p.productId._id) {
          acc[p.productId._id] = p.quantity;
        }
        return acc;
      }, {});

      setSelectedItems(selected);
      setQuantities(quantityMap);
      setAmountPaid(purchaseData.amountPaid);
    }
  }, [isEditing, items, purchaseData]);
  // console.log("items: ",purchaseDat)

  useEffect(() => {
    const newTotalAmount = selectedItems.reduce((acc, id) => {
      const item = items.find((prod) => prod._id === id);
      const qty = Number(quantities[id] ?? 0);
      const price = Number(item?.sellPrice ?? 0);

      return acc + qty * price;
    }, 0);
    setTotalAmount(newTotalAmount);
  }, [selectedItems, quantities, items]);
  

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = (id, value) => {
    let qty = Number(value);
   

    const item = items.find((prod) => prod._id === id);
    const previousQty = quantities[id] || 0;
    const currentStock = liveStock[id] ?? item?.stock ?? 0;

    const updatedStock = currentStock - (qty - previousQty); // subtract the delta

    if (updatedStock < 0) {
      toast.warn(`${languages.selectedStockExeeded}`);
      return;
    }

    // Update quantities and liveStock
    setQuantities((prev) => ({
      ...prev,
      [id]: qty,
    }));

    setLiveStock((prevStock) => ({
      ...prevStock,
      [id]: updatedStock,
    }));
  };
  
  
  
  

  const handleSavePurchase = async () => {
    try {
      if (selectedItems.length === 0) {
        toast.warn(`${languages.selectAtLeatOne}`);
        return;
      }

      const products = selectedItems.map((id) => {
        const item = items.find((prod) => prod._id === id);
        return {
          productId: id,
          name: item?.name || "Unknown",
          quantity: Number(quantities[id]),
          price: Number(item?.sellPrice || 0),
        };
      });

      const paidAmount = Number(amountPaid) || 0;
      const total = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
      const remainingBalance = total - paidAmount;

      if (isEditing) {
        // ✅ Update existing purchase
        
        await axios.put(`${BASE_URL}/purchases/update/${purchaseData._id}`, {
          products,
          amountPaid: paidAmount,
          totalAmount: total,
          remainingBalance,
        });
        toast.success(`${languages.purchaseUpdatedSuccess}`);
      } else {
        // ✅ Create new purchase
        await axios.post(`${BASE_URL}/purchases/create`, {
          customerId,
          products,
          remainingBalance,
          amountPaid: paidAmount,
          billNumber,
          totalAmount: total,
        });
        toast.success(`${languages.purchaseRecordeddSuccess}`);
      }

      setTimeout(() => {
        
        setSelectedEntry(null)
        dispatch(fetchCustomerTransactions(customerId));
        dispatch(fetchCustomers());
        onClose();
      }, 800);
     
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (isEditing
            ? "Failed to update purchase."
            : "Failed to record purchase.")
      );
    }
  };


  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Receipt",
  });

  useEffect(() => {
    if (display && shouldPrint) {
      // Timeout ensures the DOM updates before printing
      
        reactToPrintFn();
        setShouldPrint(false); // reset
      
      
    }
  }, [display, shouldPrint, reactToPrintFn]);
  

  const handleClose = () => {
    if (!isEditing) {
      setSelectedItems([]);
      setQuantities({});
      setAmountPaid("");
      setSearchTerm("");
      setBillNumber("");
      setTotalAmount(0);
      setLiveStock({});
    }
    setDisplay(false);
    setShouldPrint(false);
    setSelectedEntry(null);

    onClose();
  };
  
  if (!isOpen) return null;

  const remaining = totalAmount - Number(amountPaid);
    
  return (
    <>
      <div className="item-modal-overlay">
        <div className="additem-modal-container">
          <div className="additem-modal-header">
            <h2>
              {isEditing ? `${languages.editItem}` : `${languages.addItem}`}
            </h2>
            <button className="close" onClick={handleClose}>
              <img src={Cross} />
            </button>
          </div>

          <input
            type="text"
            placeholder={languages.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="item-list">
            {items
              .filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item._id}
                  className="item"
                  style={{
                    backgroundColor: theme === "light" ? "#f8f8f8" : "#333333",
                  }}
                >
                  <label className="checkbox-label ">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                    />
                    <div className="flex justify-between w-full">
                      <span>{item.name}</span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          (liveStock[item._id] ?? item.stock) === 0
                            ? "bg-red-100 text-red-700"
                            : (liveStock[item._id] ?? item.stock) < 10
                            ? "bg-yellow-200 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {languages.stock}: {liveStock[item._id] ?? item.stock}
                      </span>
                    </div>
                  </label>

                  {selectedItems.includes(item._id) && (
                    <div className="input-row">
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={quantities[item._id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(item._id, e.target.value)
                        }
                        className="qty-input"
                      />
                      <span className="price-label">
                        {languages.rate}: Rs{" "}
                        {Number(quantities[item._id] || 1) * item.sellPrice}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* total payments and paying section    */}
          <div className="flex justify-between w-full">
            <div className="amount-paid flex-2">
              <h3>{languages.amountPaid}</h3>
              <input
                type="number"
                placeholder="Rs 0"
                className="amount-input"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-col items-center gap-1 rounded-lg shadow-sm amount-paid">
              <h3 className="text-lg">{languages.total}</h3>
              <span className="text-lg font-semibold mt-[6px] border py-4 px-6 rounded-lg bg-gray-100 text-gray-900">
                Rs {totalAmount}
              </span>
            </div>
          </div>
          <div className="item-buttons">
            <button className="submit-btn" onClick={handleSavePurchase}>
              {isEditing ? `${languages.updatePurchase}` : `${languages.save}`}
            </button>
            <button
              className="print-btn"
              disabled={
                quantities && Object.keys(quantities).length > 0 ? false : true
              }
              onClick={() => {
                setDisplay(true);
                setShouldPrint(true); // tell the effect below to print
              }}
            >
              <img src={Print} alt="Print" />
            </button>
          </div>
        </div>
      </div>
      {/* Hidden printable component */}
      {display && (
        <div
          className="bill-container bill-container print-hidden"
          ref={contentRef}
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            padding: "25px",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0,0,0,0.08)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Header section with logo and receipt info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
              paddingBottom: "20px",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <div style={{ width: "100px" }}>
              <img
                src={Logo}
                alt="Company Logo"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "12px",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                M Wali Vegetables
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <h2
                style={{
                  margin: "0 0 5px 0",
                  color: "#2c3e50",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                INVOICE
              </h2>
              <p
                style={{
                  margin: "3px 0",
                  color: "#7f8c8d",
                  fontSize: "13px",
                }}
              >
                Receipt #: {billNumber}
              </p>
              <p
                style={{
                  margin: "3px 0",
                  color: "#7f8c8d",
                  fontSize: "13px",
                }}
              >
                Date:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontWeight: "bold",
                  color: "#3498db",
                  fontSize: "14px",
                }}
              >
                Customer: {customerName}
              </p>
            </div>
          </div>

          {/* Items table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "25px",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  textTransform: "uppercase",
                  fontSize: "13px",
                }}
              >
                <th style={{ padding: "12px 10px", textAlign: "left" }}>
                  Items
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    textAlign: "center",
                    width: "15%",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    textAlign: "right",
                    width: "20%",
                  }}
                >
                  Unit Price
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    textAlign: "right",
                    width: "20%",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((id) => {
                const item = items.find((prod) => prod._id === id);
                const qty = quantities[id] || 1;
                return (
                  <tr
                    key={id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      ":hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <td style={{ padding: "12px 10px" }}>
                      {item?.name || "Unknown Item"}
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>
                      {qty}
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      Rs {item?.sellPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      Rs {(qty * (item?.sellPrice || 0)).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary section */}
          <div
            className="bill-summary"
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                marginTop: "0",
                marginBottom: "15px",
                color: "#2c3e50",
                fontSize: "16px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Payment Details
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "12px 0",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "500" }}>Subtotal:</span>
              <span>Rs {totalAmount.toFixed(2)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "12px 0",
                alignItems: "center",
                fontWeight: "600",
              }}
            >
              <span>Total Amount:</span>
              <span>Rs {totalAmount.toFixed(2)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "12px 0",
                alignItems: "center",
                fontWeight: "600",
              }}
            >
              <span>Amount Paid:</span>
              <span>Rs {amountPaid}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "15px 0 5px",
                alignItems: "center",
                fontWeight: "700",
                fontSize: "15px",
                paddingTop: "10px",
                borderTop: "1px dashed #ccc",
              }}
            >
              <span>Balance Due:</span>
              <span
                style={{
                  color: remaining <= 0 ? "#27ae60" : "#e74c3c",
                  fontSize: "16px",
                }}
              >
                Rs {Math.abs(remaining).toFixed(2)}{" "}
                {remaining <= 0 ? "(Paid in full)" : ""}
              </span>
            </div>
          </div>

          {/* Footer section */}
          <div
            style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontSize: "12px",
              paddingTop: "15px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <p style={{ margin: "5px 0", lineHeight: "1.5" }}>
              <strong>Thank you for your business!</strong>
              <br />
              Please retain this receipt for your records
            </p>
            <p style={{ margin: "8px 0", fontStyle: "italic" }}>
              For any inquiries, contact us at:
              <br />
              Phone: (123) 456-7890
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "11px",
                color: "#aaa",
              }}
            >
              This is computer generated receipt and does not require signature
            </p>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default AddItemModal;
