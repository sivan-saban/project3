import { combineReducers, createStore } from "redux";
import { configureStore} from "@reduxjs/toolkit"
import { vacationReducer } from "./vacationState";

//איחוד כל הרדיוסרים
const reducers = combineReducers({vacationReducer:vacationReducer});
//החצנה של סטור ושמירה של כל הרדיוסרים במשתנה סטור
export const store = configureStore({reducer:reducers});

//export const store = createStore(vacationReducer);