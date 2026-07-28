import axios from "./axiosInstance";

export const createPaymentOrder = (data) =>
  axios.post("/payment/create-order", data);

export const verifyPayment = (data) =>
  axios.post("/payment/verify", data);