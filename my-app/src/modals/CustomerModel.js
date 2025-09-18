import React, { useState } from "react";
import "../styles/customerModel.css";
import close from "../images/cross-small.png";
import Modal from 'react-modal'; // Changed from { Modal } to Modal
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from './../redux/customersSlice';
import { setLanguage } from "../utils/languages";

const CustomerModel = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profilePicture: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // Preview image state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Preview image state
  const dispatch = useDispatch()
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.match(/^\d{11}$/))
      newErrors.phone = "Invalid phone number (11 digits)";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const formDataObj = new FormData();
        formDataObj.append("name", formData.name);
        formDataObj.append("phone", formData.phone);
        if (formData.profilePicture) {
          formDataObj.append("profilePicture", formData.profilePicture);
        }

        const response = await fetch(
          "http://localhost:5000/api/customers/create",
          {
            method: "POST",
            body: formDataObj,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add customer");
        }

        setIsConfirmModalOpen(true);
        setFormData({
          name: "",
          phone: "",
          profilePicture: null,
        });
        setImagePreview(null);
        // Removed onClose() from here as it's called in closeModal
      } catch (error) {
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profilePicture: file }));

      // Generate image preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

   const closeModal = () => {
     setIsConfirmModalOpen(false);
     dispatch(fetchCustomers()) // Fixed: changed isConfirmModalOpen to setIsConfirmModalOpen
     onClose(); // Added onClose here to close the main modal after confirmation
   };

   const language = useSelector((state) => state.language.mode);
   const languages = setLanguage(language);

  return (
    <div className="modal-overlay">
      <div className="customer-modal">
        <div className="customer-modal-header">
          <h3>{languages.addCustomer}</h3>
          <button onClick={onClose} className="close-button">
            <img src={close} alt="close icon" />
          </button>
        </div>

        <form className="customer-modal-body" onSubmit={handleSubmit}>
          <div className="avatar-section">
            <label className="customer-avatar">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="preview-image"
                />
              ) : formData.name ? (
                formData.name[0].toUpperCase()
              ) : (
                "+"
              )}
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </label>
            <span className="upload-text">{languages.uploadImg}</span>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder={languages.custmName}
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              placeholder={languages.phone}
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "error" : ""}
              style={{
                direction: `${language === "urdu" ? "rtl" : "ltr"}`,
              }}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? `${languages.adding}` : `${languages.addCustomer}`}
          </button>
        </form>
      </div>
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-body">
          <h2>{languages.userSuccessAdd}</h2>

          <button onClick={closeModal} className="close-btn">
            {languages.ok}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerModel;
