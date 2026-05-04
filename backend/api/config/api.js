const LOCAL_API = import.meta.env.VITE_API_BASE_URL;
const LIVE_API = import.meta.env.VITE_RENDER_API_BASE_URL;

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? LOCAL_API
    : LIVE_API;

export default API_BASE_URL.replace(/\/$/, "");