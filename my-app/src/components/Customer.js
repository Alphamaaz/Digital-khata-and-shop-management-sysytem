import React from "react";
import "../styles/customer.css";
import { getThemeStyles } from "../utils/themeStyle";
import { useSelector } from "react-redux";
import { setLanguage } from "../utils/languages";

const Customer = ({
  name,
  date,
  amount,
  image,
  id,
  activeCustomer,
  setActiveCustomer,
  setSelectedCustomer,
  onCustomerClick,
}) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const theme = useSelector((state) => state.theme.mode);
  const language = useSelector((state) => state.language.mode);

  const themeStyles = getThemeStyles(theme);
  const languages = setLanguage(language);

  const formatAmount = (amount) => amount.toLocaleString("en-US");

  return (
    <div
      className={`customer-container ${
        activeCustomer === id ? "customer-active" : ""
      }`}
      style={{ borderBottom: `1px solid ${themeStyles.borderColor}` }}
      onClick={() => {
        setActiveCustomer(id);
        setSelectedCustomer(true);
        onCustomerClick(id);
      }}
    >
      <div className="customer-main">
        <div
          className="customer-avatar"
          style={{
            backgroundColor: theme === "light" ? "#D6EAF8" : "",
          }}
        >
          {image ? (
            <img src={image} alt={name} className="customer-image" />
          ) : (
            <div className="placeholder-avatar">{firstLetter}</div>
          )}
        </div>
        <div
          className="customer-details"
          style={{
            margin: language === "urdu" ? "0 12px 0 0" : "0 0 0 12px",
          }}
        >
          <div className="customer-header">
            <span
              className="customer-name"
              style={{ color: themeStyles.textColor }}
            >
              {name}
            </span>
            <span
              className="customer-role"
              style={{ backgroundColor: themeStyles.backgroundColor }}
            >
              {languages.cust}
            </span>
          </div>
          <div
            className="customer-timestamp"
            style={{ color: themeStyles.textColor }}
          >
            <span>{date}</span>
          </div>
        </div>
      </div>
      <div
        className="customer-amount"
        style={{ color: amount === 0 ? "gray" : "#28a745" }}
      >
        Rs {formatAmount(amount)}
      </div>
    </div>
  );
};

// ✅ Memoize the component
export default React.memo(Customer, (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.amount === nextProps.amount &&
    prevProps.image === nextProps.image &&
    prevProps.id === nextProps.id &&
    prevProps.date === nextProps.date &&
    prevProps.activeCustomer === nextProps.activeCustomer
  );
});
