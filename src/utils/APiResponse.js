// Define a class named ApiResponse to standardize API responses
class ApiResponse {
    // Constructor method to initialize the response object
    constructor(status, message = "Success", data) {
        this.status = status;  // Store the HTTP status code (e.g., 200, 404)
        this.message = message;  // Store the success message (default: "Success")
        this.data = data;  // Store any data returned by the API

        // Determine if the request was successful based on the status code
        this.success = status < 400; // ✅ Fix: Corrected the variable name from "sucess" to "success"
    }
}

// Export the ApiResponse class so it can be used in other files
export { ApiResponse };
