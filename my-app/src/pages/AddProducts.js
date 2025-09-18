import React, { useCallback, useEffect, useState } from "react";
import "../styles/AddProducts.css";
import { setLanguage } from "../utils/languages";
import { useSelector, useDispatch } from "react-redux";
import Edit from "../images/pencil (1).png";
import Delete from "../images/trash (1).png";
import Add from "../images/plus (1).png";
import ProductModel from "./../modals/ProductModel";
import { fetchProducts } from "../redux/productSlice";
import axios from "axios";
import BASE_URL from "../utils/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProducts = () => {
  const language = useSelector((state) => state.language.mode);
  const languages = setLanguage(language);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // ✅ Track which product is being edited
  const theme = useSelector((state) => state.theme.mode);

  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.products);

  
  useEffect(() => {
    dispatch(fetchProducts()); // ✅ Fetch products on mount
  }, [dispatch]);

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = useCallback(
    async (id) => {
      try {
        const response = await axios.delete(
          `${BASE_URL}/products/delete/${id}`
        );
        toast.warn(response.data.message);
        dispatch(fetchProducts());
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    },
    [dispatch]
  );

  const openModalForAdd = useCallback(() => {
    setEditProduct(null);
    setIsModalOpen(true);
  }, []);

  const openModalForEdit = useCallback((product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  }, []);
  

  return (
    <div
      className={`products-container ${language === "urdu" ? "rtl" : "ltr"}`}
    >
      <div className="add-products">
        <ProductModel
          isOpen={isModalOpen}
          onClose={closeModal}
          languages={languages}
          editProduct={editProduct}
        />
        

        <div className="header-section">
          <h1>{languages.addProductsTitle || "Manage Products"}</h1>
          <button className="add-product-btn" onClick={openModalForAdd}>
            <img
              src={Add}
              alt="add"
              className="btn-icon"
              style={{
                marginRight: `${language === "urdu" ? "0px" : "5px"}`,
                marginLeft: `${language === "urdu" ? "5px" : "0px"}`,
                filter: `${theme === "dark" ? "brightness(0) invert(1)" : ""}`,
              }}
            />
            {languages.addNewProduct || "Add New Product"}
          </button>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: `${language === "urdu" ? "right" : "left"}`,
                  }}
                >
                  {languages.productName || "Product Name"}
                </th>
                <th
                  style={{
                    textAlign: `${language === "urdu" ? "right" : "left"}`,
                  }}
                >
                  {languages.price || "Price (Rs)"}
                </th>
                <th
                  style={{
                    textAlign: `${language === "urdu" ? "right" : "left"}`,
                  }}
                >
                  {languages.stock}
                </th>
                <th
                  style={{
                    textAlign: `${language === "urdu" ? "right" : "left"}`,
                  }}
                >
                  {languages.unit}
                </th>
                <th
                  style={{
                    textAlign: `${language === "urdu" ? "right" : "left"}`,
                  }}
                >
                  {languages.operations || "Operations"}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className={
                      product._id % 2 === 0 ? "table-row" : "table-row-alt"
                    }
                  >
                    <td>{product.name}</td>
                    <td>{product.purchasePrice}</td>
                    <td>{product.stock}</td>
                    <td>{product.unit}</td>
                    <td
                      className="operations"
                      style={{
                        justifyContent: `${
                          language === "urdu" ? "right" : "left"
                        }`,
                      }}
                    >
                      <button
                        className="update-btn"
                        onClick={() => openModalForEdit(product)}
                      >
                        <img
                          src={Edit}
                          alt="edit"
                          className="action-icon"
                          style={{
                            marginRight: `${
                              language === "urdu" ? "0px" : "5px"
                            }`,
                            marginLeft: `${
                              language === "urdu" ? "5px" : "0px"
                            }`,
                          }}
                        />
                        {languages.edit || "Edit "}
                      </button>
                      <button
                        className="delet-btn"
                        onClick={() => handleDelete(product._id)}
                      >
                        <img
                          src={Delete}
                          alt="delete"
                          className="action-icon"
                          style={{
                            marginRight: `${
                              language === "urdu" ? "0px" : "5px"
                            }`,
                            marginLeft: `${
                              language === "urdu" ? "5px" : "0px"
                            }`,
                          }}
                        />
                        {languages.delete || "Delete "}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-products">
                    {languages.noProducts || "No products found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer autoClose={800}/>
    </div>
  );
};

export default AddProducts;
