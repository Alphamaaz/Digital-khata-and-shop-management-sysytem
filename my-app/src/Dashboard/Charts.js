import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import BASE_URL from "../utils/baseUrl";
import { useSelector } from "react-redux";
import { setLanguage } from "../utils/languages";



const Charts = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [dataType, setDataType] = useState("sales");
  const [sales, setSales] = useState({});
  const language = useSelector((state=>state.language.mode))
  const languages = setLanguage(language)
  

  useEffect(() => {
      const fetchSalesData = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/dashboard/sales-trends?period=${timeframe}&type=${dataType}`
          );
          setSales(response.data)
          
        } catch (error) {
          console.error("Error fetching sales data:", error);
        }
      };
  
      fetchSalesData();
    }, [timeframe,dataType]);

  return (
    <div className="p-4  space-y-6 lg:mt-4">
      {/* Cards Section */}

      {/* Dropdowns */}
      <div className="flex flex-row items-center  mb-6 space-y-4 lg:space-y-0 sm:space-between">
        {/* Timeframe Dropdown */}
        <div>
          <label
            className={`text-gray-700 font-semibold ${
              language === "urdu" ? "ml-2" : "mr-2"
            }`}
            style={{ color: "var(--text-secondary)" }}
          >
            {languages.timeFrame}:
          </label>
          <select
            className="py-2 px-10  rounded-md border border-gray-300  items-center focus:outline-none focus:ring-2 focus:ring-green-500"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--btn-bg-color)",
              color: "var(--text-primary)",
              fontWeight: "var(--font-weight-secondary)",
              fontSize: "var(--font-size-secondary)",
            }}
          >
            <option value="week">{languages.week}</option>
            <option value="month">{languages.month}</option>
            <option value="year">{languages.year}</option>
          </select>
        </div>

        {/* DataType Dropdown */}
        <div>
          <label
            className={`text-gray-700 font-semibold ml-5  ${
              language === "urdu" ? "mr-4" : "mr-2"
            }`}
            style={{ color: "var(--text-secondary)" }}
          >
            {languages.dataType}:
          </label>
          <select
            className={`py-2 px-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 `}
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--btn-bg-color)",
              color: "var(--text-primary)",
              fontWeight: "var(--font-weight-secondary)",
              fontSize: "var(--font-size-secondary)",
            }}
          >
            <option value="sales">{languages.sales}</option>
            <option value="profit">{languages.profit}</option>
          </select>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          style={{
            backgroundColor: "var(--surface-color)",
            boxShadow: "var(--shadow-1)",
          }}
        >
          <h2
            className="text-xl font-bold text-gray-700 mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {timeframe} {dataType}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#27AE60" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          style={{
            backgroundColor: "var(--surface-color)",
            boxShadow: "var(--shadow-1)",
          }}
        >
          <h2
            className="text-xl font-bold text-gray-700 mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {timeframe} {dataType}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
