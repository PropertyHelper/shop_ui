import axios from "axios";

// configure API Gateway URL
const API_BASE = "http://localhost:8002";

// a unified function to perform requests
// method and url are requried params, while token, data and isForm are optional
const sendRequest = async (method, url, { token = null, data = null, isForm = false } = {}) => {
    try {
        const headers = token ? { token } : {};
        if (!isForm) headers["Content-Type"] = "application/json";

        //set up axios request
        const config = {
            method,
            url: API_BASE + url,
            headers,
            ...(data && { data }),
            ...(isForm && { timeout: 10000 }),
        };

        const response = await axios(config);
        return { status: response.status, data: response.data };
    } catch (error) {
        return {
            status: error.response?.status || 0,
            data: error.response?.data || { detail: "Unexpected error" },
        };
    }
};

// functions to interact with API. They are using sendRequest under the hood
// each function is self-explanotory by name
export const sendLogInRequest = (payload) =>
    sendRequest("post", "/shop/login", { data: payload });

export const fetchShopStats = (token) =>
    sendRequest("get", "/shop/stats", { token });

export const addCashier = (token, cashierData) =>
    sendRequest("post", "/shop/cashier", { token, data: cashierData });

export const uploadExcelFile = async (blob, token) => {
    const formData = new FormData();
    const timestamp = Date.now();
    const filename = `catalog-${timestamp}.xlsx`;
    formData.append("file", blob, filename);

    return sendRequest("post", "/shop/add_inventory", {
        token,
        data: formData,
        isForm: true,
    });
};
