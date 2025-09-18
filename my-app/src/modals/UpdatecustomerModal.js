import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UpdateCustomerModal.css"; // Add your styles here
import BASE_URL from "../utils/baseUrl";
import { fetchCustomers } from "../redux/customersSlice";
import { useDispatch, useSelector } from "react-redux";
import {  toast, ToastContainer } from "react-toastify";
import { setLanguage } from "../utils/languages";
import Close from '../images/cross-small (1).png'


const UpdateCustomerModal = ({ customerId, onClose }) => {
  const language = useSelector((stat=>stat.language.mode ))
  const lagnguages = setLanguage(language)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cnic: "",
    address: "",
    profilePicture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch()
  // Fetch customer data when the modal opens
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/customers/${customerId}`
        );
        const customer = response.data;

        setFormData({
          name: customer.name,
          phone: customer.phone,
          cnic: customer.cnic,
          address: customer.address,
          profilePicture: customer.profilePicture,
        });

        if (customer.profilePicture) {
          setImagePreview(customer.profilePicture);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch customer data");
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("cnic", formData.cnic);
      formDataObj.append("address", formData.address);
      if (formData.profilePicture instanceof File) {
        formDataObj.append("profilePicture", formData.profilePicture);
      }

      console.log("Sending Update Request..."); // Debug log
      const response = await axios.put(
        `${BASE_URL}/customers/update/${customerId}`,
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(`${lagnguages.customerUpdateSuccess}`);
      setTimeout(()=>{
        dispatch(fetchCustomers());
        onClose(); // Close the modal
      },1000)
      
    } catch (error) {
      console.error("Update Error:", error); // Debug log
      if (error.response) {
        // The request was made and the server responded with a status code
        
        toast.warn(
          `Error: ${error.response.data.message || "Failed to update customer"}`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request:", error.request);
        alert("Network error: No response received from the server");
      } else {
        // Something happened in setting up the request
        console.error("Error Message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    }
  };
  const DeleteCustomerModal = async(id)=>{
    // Delete Customer functionality goes here
    // Delete Customer API goes here
    try {
      await axios.delete(`${BASE_URL}/customers/delete/${id}`)
      toast.success(`${lagnguages.customerDeletedSuccess}`);
      console.log("Customer deleted successfully");
      setTimeout(() => {
        dispatch(fetchCustomers());
        onClose(); // Close the modal
      }, 1000);
    } catch (error) {
      console.error("Delete Error:", error);
      toast.warn("Failed to delete customer");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="updated-modal-overlay">
      <div className="updated-modal-content">
        <div className="updated-modal-header">
          <h3>{lagnguages.EditCustomer}</h3>
          <button onClick={onClose} className="updated-modal-close-button">
            <img src={Close} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="updated-modal-body">
          <div className="updated-modal-avatar-section">
            <label className="updated-modal-customer-avatar">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="updated-modal-preview-image"
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
            <span className="upload-text">{lagnguages.uploadImg}</span>
          </div>

          <div className="updated-modal-input-group">
            <input
              type="text"
              name="name"
              placeholder={lagnguages.name}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="updated-modal-input-group">
            <input
              type="tel"
              name="phone"
              placeholder={lagnguages.phone}
              value={formData.phone}
              onChange={handleChange}
              style={{
                direction: `${language === "urdu" ? "rtl" : "ltr"}`,
              }}
            />
          </div>

          <div className="updated-modal-input-group">
            <input
              type="text"
              name="cnic"
              placeholder={lagnguages.cnic}
              value={formData.cnic}
              onChange={handleChange}
            />
          </div>

          <div className="updated-modal-input-group">
            <textarea
              name="address"
              placeholder={lagnguages.address}
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="updated-modal-submit-button">
            {lagnguages.updateCustomer}
          </button>
          <button
            className="updated-modal-delete-button"
            onClick={() => DeleteCustomerModal(customerId)}
          >
            {lagnguages.DeleteCustomer}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateCustomerModal;
