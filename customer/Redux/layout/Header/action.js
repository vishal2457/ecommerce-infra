import api from "../../api";

import {GENERIC_ERROR, GET_NOTIFICATION, REMOVE_NOTIFICATION, SET_NOTIFICATION} from "./types";

export const setNotification = (data) => async dispatch => {
dispatch({type: SET_NOTIFICATION, payload: data})
}

export const getNotification = (obj) => async dispatch => {
    await api.post('/notifications/getNotification', obj)
    .then(res => dispatch({type: GET_NOTIFICATION, payload: res.data, notificationTab: obj.notificationTab}))
    .catch(err => dispatch({type: GENERIC_ERROR, payload: err}))
}

export const removeNotification = (type) => async dispatch => {
    await api.post(`/notifications/readNotification`, {type})
    .then(res => dispatch({type: REMOVE_NOTIFICATION, payload: type}))
    .catch(err => dispatch({type: GENERIC_ERROR, payload: err}))
}

export const clearNotification = () => async dispatch =>{
    await api.get('/notifications/clearNotification', ) 
    .then(res => dispatch({type: CLEAR_NOTIFICATION}))
    .catch(err => console.log(err))
}