import React from "react";
import DashboardCards from "./DashboardCards";
import Charts from "./Charts";
import TopLists from "./TopLists";
import { useSelector } from "react-redux";


const Dashboard = () => {
  const language = useSelector((state=>state.language.mode))
  return (
    <>
      <div className={`p-6 ${language==="urdu"?"lg:mr-[80px]":"lg:ml-[80px]"}`} >
        <DashboardCards />
        <Charts />
        <TopLists/>s
      </div>
    </>
  );
};

export default Dashboard;
