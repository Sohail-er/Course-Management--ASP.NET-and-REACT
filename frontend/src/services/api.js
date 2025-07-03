const API_BASE_URL = "http://localhost:5000/api"; // ASP.NET Core HTTP port

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem("auth-token");
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem("auth-token", token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem("auth-token");
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.removeAuthToken();
          window.location.href = "/login";
          throw new Error("Unauthorized - please login again");
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
