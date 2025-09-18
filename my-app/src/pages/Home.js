import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import CustomersPortion from "./../components/CustomersPortion";
import CustomerDetails from "./CustomerDetails";
import EntryDetails from "./EntryDetails";

const Home = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [removeClass, setRemoveClass] = useState(false);
  const [purchaseId, setPurchaseId] = useState(null);
  const [type, setType] = useState(null);
  const [CustomerID, setCustomerId] = useState(null);
  const [totalDebt, setTotalDebt] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setSelectedEntry(null);
  };

  const handleEntryClick = (Id, type, totalDebt, customerID) => {
    setPurchaseId(Id);
    setType(type);
    setCustomerId(customerID);
    setTotalDebt(totalDebt);
  };

  let layoutStyle = {};
  if (selectedCustomer && selectedEntry)
    layoutStyle = { gridTemplateColumns: "33% 40% 27%" };
  else if (selectedCustomer) layoutStyle = { gridTemplateColumns: "40% 60%" };
  else layoutStyle = { gridTemplateColumns: "40%" };

  return isMobile ? (
    <div className="mobile-container">
      {!selectedCustomer && !selectedEntry && (
        <CustomersPortion
          setSelectedCustomer={setSelectedCustomer}
          onCustomerClick={handleCustomerClick}
        />
      )}

      {selectedCustomer && !selectedEntry && (
        <CustomerDetails
          setSelectedEntry={setSelectedEntry}
          setRemoveClass={setRemoveClass}
          onEntryClick={handleEntryClick}
          customerId={selectedCustomer}
        />
      )}

      {selectedEntry && (
        <EntryDetails
          setSelectedEntry={setSelectedEntry}
          setRemoveClass={setRemoveClass}
          purchaseId={purchaseId}
          type={type}
          customerID={CustomerID}
          totalDebt={totalDebt}
        />
      )}
    </div>
  ) : (
    <div className="grid-container" style={layoutStyle}>
      <div className="left-column">
        <CustomersPortion
          setSelectedCustomer={setSelectedCustomer}
          onCustomerClick={handleCustomerClick}
        />
      </div>

      {selectedCustomer && (
        <div className="right-column">
          <CustomerDetails
            setSelectedEntry={setSelectedEntry}
            setRemoveClass={setRemoveClass}
            onEntryClick={handleEntryClick}
            customerId={selectedCustomer}
          />
        </div>
      )}

      {selectedEntry && (
        <div className="right-most-column">
          <EntryDetails
            setSelectedEntry={setSelectedEntry}
            setRemoveClass={setRemoveClass}
            purchaseId={purchaseId}
            type={type}
            customerID={CustomerID}
            totalDebt={totalDebt}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
