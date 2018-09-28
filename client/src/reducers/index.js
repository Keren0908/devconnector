import { combineReducer, combineReducers } from 'redux';
imprt authReducer from './authReducer';

export default combineReducers({
    auth: authReducer
});