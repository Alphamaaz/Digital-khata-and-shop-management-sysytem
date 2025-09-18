import { createSlice } from "@reduxjs/toolkit"

const initialLanguage = localStorage.getItem("language")||"english"
const languageSlice = createSlice({
    name:'language',
    initialState:{mode:initialLanguage},
    reducers:{
        toggleLanguage : (state)=>{
            state.mode = state.mode === "english"?"urdu":"english";
            localStorage.setItem('language',state.mode)
        },
        setLanguages : (state,action)=>{
            state.mode = action.payload
                        localStorage.setItem("language", state.mode);

        }
    }
})
export const {toggleLanguage,setLanguages} = languageSlice.actions
export default languageSlice.reducer