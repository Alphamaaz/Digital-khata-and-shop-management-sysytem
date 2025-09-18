import React, { useState } from "react";
import "../styles/FilterModal.css";
import { setLanguage } from "../utils/languages";
import { useSelector } from "react-redux";

const FilterModal = ({ isOpen, onClose, onApplyFilters }) => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const language = useSelector((state) => state.language.mode);
  const languages = setLanguage(language);
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleApply = () => {
    onApplyFilters(selectedFilter);
    onClose(); // Close the modal after applying the filter
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="filter-modal-content">
        <h2>{languages.filter}</h2>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="Highest Amount"
              checked={selectedFilter === "Highest Amount"}
              onChange={handleFilterChange}
            />
            {languages.highest}
          </label>
          <label>
            <input
              type="radio"
              value="Ascending"
              checked={selectedFilter === "Ascending"}
              onChange={handleFilterChange}
            />
            {languages.Assending}
          </label>
          <label>
            <input
              type="radio"
              value="Least Amount"
              checked={selectedFilter === "Least Amount"}
              onChange={handleFilterChange}
            />
            {languages.least}
          </label>
          <label>
            <input
              type="radio"
              value="descending"
              checked={selectedFilter === "descending"}
              onChange={handleFilterChange}
            />
           {languages.dessending}
          </label>
          {/* Add more filters as needed */}
        </div>
        <div className="modal-buttons">
          <button onClick={handleApply} className="button">
            {languages.applyFilter}
          </button>
          <button onClick={onClose} className="button">
            {languages.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
