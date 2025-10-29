import jwtDecode from "jwt-decode";

export const isAuthenticated = () => {
    const token = localStorage.getItem("access");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (err) {
        return false;
    }
};
