import outputReducer from "./outputReducer";
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    output: outputReducer
})

export default allReducers;