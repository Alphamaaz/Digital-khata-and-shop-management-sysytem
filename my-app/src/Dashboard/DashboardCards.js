import React, { useEffect, useState, useMemo, useCallback } from "react";
import BASE_URL from "./../utils/baseUrl";
import axios from "axios";
import { useSelector } from "react-redux";
import { setLanguage } from "../utils/languages";

function DashboardCards() {
  const [timeframe, setTimeframe] = useState("Year");
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalProfit: 0,
    overAllDebt: 0,
    totalCustomers: 0,
  });

  const language = useSelector((state) => state.language.mode);
  const languages = useMemo(() => setLanguage(language), [language]);

  const fetchSalesData = useCallback(async (period) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/dashboard/sales-profit?period=${period}`
      );
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSalesData(timeframe);
    }, 300); // debounce to reduce unnecessary requests

    return () => clearTimeout(delayDebounce);
  }, [timeframe, fetchSalesData]);

  const formatAmount = useCallback((amount) => {
    return amount.toLocaleString("en-US");
  }, []);

  const cardStyles =
    "rounded-2xl transition h-48 flex flex-col justify-center items-center text-center shadow-md hover:shadow-lg";

  return (
    <div className="p-4 lg:pd-6">
      {/* Timeframe Selector */}
      <div className="mb-4">
        <label
          className="font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          {languages.timeFrame}:
        </label>
        <select
          className={`py-2 px-10 rounded-md border focus:outline-none focus:ring-2 ${
            language === "urdu" ? "mr-2" : "ml-2"
          }`}
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--btn-bg-color)",
            color: "var(--text-primary)",
            fontWeight: "var(--font-weight-secondary)",
            fontSize: "var(--font-size-secondary)",
          }}
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="Week">{languages.week}</option>
          <option value="Month">{languages.month}</option>
          <option value="Year">{languages.year}</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div
          className={cardStyles}
          style={{
            backgroundColor: "var(--surface-color)",
            color: "var(--text-secondary)",
            boxShadow: "var(--shadow-1)",
          }}
        >
          <h2>{languages.sales}</h2>
          <p
            className="text-3xl font-bold mt-4"
            style={{ color: "var(--primary-500)" }}
          >
            {formatAmount(salesData.totalSales)}
          </p>
        </div>

        {/* Total Profit */}
        <div
          className={cardStyles}
          style={{
            backgroundColor: "var(--surface-color)",
            color: "var(--text-secondary)",
            boxShadow: "var(--shadow-1)",
          }}
        >
          <h2>{languages.totalProfit}</h2>
          <p className="text-3xl font-bold mt-4" style={{ color: "#2ECC71" }}>
            {formatAmount(salesData.totalProfit)}
          </p>
        </div>

        {/* Total Debt */}
        <div
          className={cardStyles}
          style={{
            backgroundColor: "var(--surface-color)",
            color: "var(--text-secondary)",
            boxShadow: "var(--shadow-1)",
          }}
        >
          <h2>{languages.debt}</h2>
          <p className="text-3xl font-bold mt-4" style={{ color: "red" }}>
            {formatAmount(salesData.overAllDebt)}
          </p>
        </div>

        {/* Total Customers */}
        <div
          className={cardStyles}
          style={{
            backgroundColor: "var(--surface-color)",
            color: "var(--text-secondary)",
            boxShadow: "var(--shadow-1)",
          }}
        >
          <h2>{languages.customer}</h2>
          <p className="text-3xl font-bold mt-4" style={{ color: "purple" }}>
            {formatAmount(salesData.totalCustomers)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;
