import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";

// توفير البيانات: نضع التوكن في كل طلبية للوحة التحكم
const httpClient = (url, options = {}) => {
  if (!options.headers)
    options.headers = new Headers({ Accept: "application/json" });
  const token = localStorage.getItem("token");
  if (token) options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  httpClient,
);

// توفير الصلاحيات: React Admin سيسأل هذه الدالة إذا كان المستخدم أدمن أم لا
export const authProvider = {
  login: () => Promise.resolve(), // اللوجين يتم من واجهتنا الخاصة
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/";
    return Promise.resolve();
  },
  checkAuth: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token && role === "admin" ? Promise.resolve() : Promise.reject();
  },
  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () =>
    localStorage.getItem("role")
      ? Promise.resolve(localStorage.getItem("role"))
      : Promise.reject(),
};
