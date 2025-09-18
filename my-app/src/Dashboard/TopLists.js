import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../utils/baseUrl";
import { setLanguage } from "../utils/languages";
import { useSelector } from "react-redux";

const TopLists = () => {
  const [customers, setCustomers] = useState({
    topDebtors: [],
    topCustomers: [],
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/dashboard/top-customers`);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const formatAmount = (amount) => {
    return amount.toLocaleString("en-US");
  };
 const language = useSelector((state) => state.language.mode);
 const languages = setLanguage(language);
  
  return (
    <div className="p-4 lg:py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
          style={{
            backgroundColor: "var(--surface-color)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            fontWeight: "var(--font-weight-secondary)",
            fontSize: "var(--font-size-secondary)",
          }}
        >
          <h2 className="text-xl font-bold text-red-500 dark:text-red-400 mb-4">
            {languages.topDebtors}
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md overflow-hidden">
            {customers.topDebtors.map((debtor, index) => (
              <div
                key={index}
                className={`flex justify-between items-center px-4 py-3 ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
                style={{
                  backgroundColor:
                    index % 2 === 0 ? "var(--hover-bg-color)" : "transparent",
                }}
              >
                <span
                  className="text-gray-700 dark:text-gray-200 font-medium"
                  style={{ color: "var(--text-primary)" }}
                
                  >{debtor.name}
                </span>
                <span className="text-red-500 dark:text-red-400 font-semibold">
                  Rs. {formatAmount(debtor.totalDebt)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
          style={{
            backgroundColor: "var(--surface-color)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            fontWeight: "var(--font-weight-secondary)",
            fontSize: "var(--font-size-secondary)",
          }}
        >
          <h2 className="text-xl font-bold text-green-500 dark:text-green-400 mb-4">
           {languages.topSalers}
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md overflow-hidden">
            {customers.topCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-3"
                style={{
                  backgroundColor:
                    index % 2 === 0 ? "var(--hover-bg-color)" : "transparent",
                }}
              >
                <span
                  className="text-gray-700 dark:text-gray-200 font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {customer.name}
                </span>
                <span className="text-green-500 dark:text-green-400 font-semibold">
                  Rs. {formatAmount(customer.totalSpent)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopLists;
