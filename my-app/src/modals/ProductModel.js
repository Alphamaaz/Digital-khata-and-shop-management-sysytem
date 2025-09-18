import React, { useCallback, useEffect, useState } from "react";
import "../styles/productModel.css";
import CloseIcon from "../images/cross-small.png";
import { setLanguage } from "../utils/languages";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../utils/baseUrl";
import { fetchProducts } from "../redux/productSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProductModel = ({ isOpen, onClose, editProduct }) => {
  const language = useSelector((state) => state.language.mode);
  const languages = setLanguage(language);
  const dispatch = useDispatch()

  // ✅ Initialize state with `editProduct` values if provided
  const [productData, setProductData] = useState({
    name: editProduct?.name || "",
    sellPrice: editProduct?.sellPrice || "",
    purchasePrice: editProduct?.purchasePrice || "",
    stock:editProduct?.stock || "",
    unit: editProduct?.unit || "piece",
  });

  // ✅ Update state when `editProduct` changes (important!)
  useEffect(() => {
    setProductData({
      name: editProduct?.name || "",
      sellPrice: editProduct?.sellPrice || "",
      purchasePrice: editProduct?.purchasePrice || "",
      stock: editProduct?.stock || "",
      unit: editProduct?.unit || "piece",
    });
  }, [editProduct]);

  // ✅ Handle form input changes
  const handleChange = useCallback((e) => {
    setProductData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (editProduct) {
          await axios.put(
            `${BASE_URL}/products/update/${editProduct._id}`,
            productData
          );
          toast.success(`${languages.productUpdatedSuccess}`);
        } else {
          await axios.post(`${BASE_URL}/products/create`, productData);
          toast.success(`${languages.productAddedSuccess}`);
        }

        setTimeout(() => {
          setProductData({
            name:  "",
            sellPrice: "",
            purchasePrice:  "",
            stock:  "",
            unit: "piece",
          });
          dispatch(fetchProducts());
          onClose(); // Close modal after updating
        }, 500);
      } catch (error) {
        toast.error(error.response?.data?.message || "Operation failed!");
      }
    },
    [productData, editProduct, dispatch, onClose]
  );
  

  if (!isOpen) return null; // ✅ Don't render if modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{editProduct ? "Edit Product" : "Add New Product"}</h3>
          <img src={CloseIcon} alt="close" onClick={onClose} />
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{languages.productName}</label>
              <input type="text" id="name" value={productData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="sellPrice">{languages.RateSell}</label>
              <input type="number" id="sellPrice" value={productData.sellPrice} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="purchasePrice">{languages.RatePurchase}</label>
              <input type="number" id="purchasePrice" value={productData.purchasePrice} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="Stock">{languages.stock}</label>
              <input type="number" id="stock" value={productData.stock} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="unit">{languages.selectUnit}</label>
              <select id="unit" value={productData.unit} onChange={handleChange}>
                <option value="kg">{languages.kg}</option>
                <option value="bag">{languages.bag}</option>
                <option value="piece">{languages.piece}</option>
                <option value="gram">{languages.gram}</option>
                <option value="milligram">{languages.milligram}</option>
              </select>
            </div>
            <button className="add-button" type="submit">
              {editProduct ? "Save Changes" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
};




export default ProductModel;
