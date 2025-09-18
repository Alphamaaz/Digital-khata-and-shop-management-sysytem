import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Customerportion.css";
import logo from "../images/logo1.png";
import Search from "../images/search.png";
import Pdf from "../images/file-pdf.png";
import Plus from "../images/add.png";
import Filter from "../images/filter.png";
import { useDispatch, useSelector } from "react-redux";
// import Add from "../images/user-add.png";
import { getThemeStyles } from "../utils/themeStyle";
import { setLanguage } from "../utils/languages";
import Customer from "../components/Customer";
import FilterModal from "./../modals/Model";
import CustomerModel from "../modals/CustomerModel";
import { fetchCustomers } from "../redux/customersSlice";
import User from "../images/user.png"
import { useReactToPrint } from "react-to-print";
import { shallowEqual } from "react-redux";
const CustomersPortion = ({ setSelectedCustomer, onCustomerClick }) => {
  const language = useSelector((state) => state.language.mode);
  const theme = useSelector((state) => state.theme.mode);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [customerModel, setCustomerModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedList, setSortedList] = useState([]);
  const dispatch = useDispatch();
  
  // Fetch customers from Redux store
  // const { customers, status, error } = useSelector((state) => state.customers);

  

  const { customers, status, error } = useSelector(
    (state) => state.customers,
    shallowEqual
  );

  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

useEffect(() => {
  if (customers.length > 0) {
    setSortedList(customers); // Set default sorted list
  }
}, [customers]);

  const themeStyles = getThemeStyles(theme);
  const languages = setLanguage(language);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  // Function to apply filters
  const applyFilters = (selectedFilter) => {
    const sortedCustomers = [...customers].sort((a, b) => {
      switch (selectedFilter) {
        case "Newest Date":
          return b.createdAt - a.createdAt;

        case "Highest Amount":
          return b.totalDebt - a.totalDebt;

        case "Least Amount":
          return a.totalDebt - b.totalDebt;

        case "Ascending":
          return a.name.localeCompare(b.name);

        case "Descending":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });
    setSortedList(sortedCustomers); // Update sorted list state
    
  };

  const filteredCustomers = useMemo(() => {
    return sortedList.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedList, searchTerm]);
  


  // Fetch customers when the component mounts
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  if (status === "loading")
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="loading-message">⏳ Loading customer details...</p>
      </div>
    );
  if (status === "failed")
    return (
      <div className="no-purchase-container">
        <p className="no-purchase-message">Error: {error}</p>
      </div>
    );

    

  return (
    <div
      className={`customers-container ${
        language === "urdu" ? "urdu-rtl" : "english-ltr"
      }`}
      style={{
        backgroundColor: themeStyles.containerBgColor,
        height: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className={`customers`}
        style={{ backgroundColor: themeStyles.backgroundColor }}
      >
        <div
          className={`head`}
          style={{
            backgroundColor: themeStyles.headBgColor,
            direction: `${language === "urdu" ? "ltr" : "rtl"}`,
          }}
        >
          <div
            className={`logo_div`}
            style={{ direction: `${language === "urdu" ? "ltr" : "rtl"}` }}
          >
            <img src={logo} alt="logo" className="logo" />
          </div>
          <h2
            className={`${language === "urdu" ? "urdu-text" : ""}`}
            style={{
              color: themeStyles.textColor,
            }}
          >
            {languages.logo}
          </h2>
        </div>
        <div
          className="head_two"
          style={{ borderBottomColor: themeStyles.borderColor }}
        >
          <div>
            <h1>{customers.length}</h1>
            <p style={{ color: themeStyles.textColor }}>{languages.customer}</p>
          </div>
          <span style={{ backgroundColor: themeStyles.borderColor }}></span>
          <div className="add" onClick={() => setCustomerModel(true)}>
            <img src={Plus} alt="add" />
            <p style={{ color: themeStyles.textColor }}>
              {language === "urdu" ? "ایڈ کسٹمر" : "Add customer"}
            </p>
          </div>
        </div>
        <div
          className="search"
          style={{
            borderBottomColor: themeStyles.borderColor,
            borderBottom: `1px solid ${themeStyles.borderColor}`,
          }}
        >
          <div
            className={`search-bar`}
            style={{
              backgroundColor: themeStyles.backgroundColor,
              border: `1px solid ${themeStyles.borderColor}`,
            }}
          >
            {/* <img
              src={Search}
              alt="search"
              className="searech_icon"
              style={{ filter: themeStyles.iconFilter }}
            /> */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === "english"
                  ? "Search customer..."
                  : "کسٹمر تلاش کریں..."
              }
              style={{
                color: themeStyles.textColor,
                backgroundColor: themeStyles.backgroundColor,
                margin: `0 ${language === "urdu" ? "5px" : "0px"} 0px ${
                  language === "enlish" ? "0px" : "5px"
                }`,
              }}
            />
          </div>
          <img
            src={Filter}
            alt="filter"
            className="searech_icon"
            style={{ filter: themeStyles.iconFilter }}
            onClick={openModal}
          />
          <img
            src={Pdf}
            alt="pdf"
            className="searech_icon"
            style={{ filter: themeStyles.iconFilter }}
            onClick={reactToPrintFn}
          />

          {/* Filter Modal */}
          <FilterModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onApplyFilters={applyFilters}
          />
        </div>

        {/* starts customers list  */}
        {customerModel && (
          <CustomerModel
            onClose={() => {
              setCustomerModel(false);
            }}
          />
        )}

        <div className="csutomers_container" ref={contentRef}>
          {filteredCustomers.length === 0 ? (
            <div className="buy">
              <img
                src={User}
                alt="but-icon"
                style={{ height: "100px", width: "100px" }}
              />
              <p>No Customer Found Please Add A Customer</p>
            </div>
          ) : (
            filteredCustomers.map((data, index) => (
              <div key={index}>
                <Customer
                  name={data.name}
                  image={data.profilePicture}
                  date={new Date(data.createdAt).toLocaleString()}
                  amount={data.totalDebt}
                  id={data._id}
                  activeCustomer={activeCustomer}
                  setActiveCustomer={setActiveCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  onCustomerClick={onCustomerClick}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPortion;
