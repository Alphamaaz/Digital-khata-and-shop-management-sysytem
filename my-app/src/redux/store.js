// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import languageReducer from "./languageSlice";
import authReducer from "./authSlice";
import purchasesReducer from "./purchasesSlice";
import customersReducer from "./customersSlice";
import transactionsReducer from "./transactionsSlice";
import productsReducer from "./productSlice";


const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    auth: authReducer, // Add auth reducer here
    purchases: purchasesReducer,
    customers: customersReducer, // Add customers reducer here
    transactions: transactionsReducer, 
    products : productsReducer,
    
  },
});

export default store;
