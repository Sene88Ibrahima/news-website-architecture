package com.newswebsite.client.soap;

import com.newswebsite.client.soap.generated.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import java.net.URL;
import java.util.List;

public class SoapClient {
    
    private static final Logger logger = LoggerFactory.getLogger(SoapClient.class);
    private static final String NAMESPACE_URI = "http://localhost:8080/soap";
    private static final String SERVICE_NAME = "UserService";
    
    protected final String serviceUrl;
    protected final String wsdlUrl;
    protected UserServiceSoap userService;
    protected String authToken;
    
    public SoapClient() {
        this("http://localhost:8080/soap");
    }
    
    public SoapClient(String serviceUrl) {
        this.serviceUrl = serviceUrl;
        this.wsdlUrl = serviceUrl + "?wsdl";
        initializeService();
    }
    
    private void initializeService() {
        try {
            URL wsdlLocation = new URL(wsdlUrl);
            QName serviceName = new QName(NAMESPACE_URI, SERVICE_NAME);
            Service service = Service.create(wsdlLocation, serviceName);
            userService = service.getPort(UserServiceSoap.class);
            logger.info("SOAP service initialized successfully");
        } catch (Exception e) {
            logger.warn("Could not initialize SOAP service: " + e.getMessage());
            logger.warn("The application will start but SOAP functionality will be unavailable until the service is running.");
            // Ne pas lancer d'exception pour permettre à l'application de démarrer
            userService = null;
        }
    }
    
    /**
     * Check if SOAP service is available
     */
    public boolean isServiceAvailable() {
        return userService != null;
    }
    
    /**
     * Authenticate user and get JWT token
     */
    public boolean authenticate(String username, String password) {
        return authenticateUser(username, password);
    }
    
    /**
     * Authenticate user and get JWT token
     */
    public boolean authenticateUser(String username, String password) {
        if (!isServiceAvailable()) {
            System.err.println("SOAP service is not available. Please ensure the server is running.");
            return false;
        }
        
        try {
            AuthenticateUserRequest request = new AuthenticateUserRequest();
            request.setUsername(username);
            request.setPassword(password);
            
            AuthenticateUserResponse response = userService.authenticateUser(request);
            
            if (response.isSuccess()) {
                this.authToken = response.getToken();
                System.out.println("Authentication successful!");
                if (response.getUser() != null) {
                    User user = response.getUser();
                    System.out.println("Welcome " + user.getUsername() + " (" + user.getRole() + ")");
                }
                return true;
            } else {
                System.err.println("Authentication failed: " + response.getError());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error authenticating user", e);
            System.err.println("Authentication failed: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Get list of users
     */
    public void getUsers(int page, int limit, String role) {
        if (!isServiceAvailable()) {
            System.err.println("SOAP service is not available. Please ensure the server is running.");
            return;
        }
        
        if (!isAuthenticated()) {
            System.err.println("Error: Not authenticated. Please log in first.");
            return;
        }
        
        try {
            GetUsersRequest request = new GetUsersRequest();
            request.setToken(authToken);
            request.setPage(page);
            request.setLimit(limit);
            if (role != null && !role.trim().isEmpty()) {
                request.setRole(role);
            }
            
            GetUsersResponse response = userService.getUsers(request);
            
            if (response.isSuccess()) {
                List<User> users = response.getUsers();
                System.out.println("\n=== Users List ===");
                System.out.println("Total: " + response.getTotal() + ", Page: " + response.getPage() + ", Limit: " + response.getLimit());
                System.out.println("ID\t\tUsername\t\tEmail\t\t\tRole\t\tCreated");
                System.out.println("-------------------------------------------------------------------");
                
                for (User user : users) {
                    System.out.printf("%-8s\t%-15s\t%-20s\t%-10s\t%s%n",
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCreatedAt()
                    );
                }
            } else {
                System.err.println("Error getting users: " + response.getError());
            }
        } catch (Exception e) {
            logger.error("Error getting users", e);
            System.err.println("Error getting users: " + e.getMessage());
        }
    }
    
    /**
     * Get user by ID
     */
    public void getUserById(String userId) {
        if (!isServiceAvailable()) {
            System.err.println("SOAP service is not available. Please ensure the server is running.");
            return;
        }
        
        if (!isAuthenticated()) {
            System.err.println("Error: Not authenticated. Please log in first.");
            return;
        }
        
        try {
            GetUserByIdRequest request = new GetUserByIdRequest();
            request.setToken(authToken);
            request.setUserId(userId);
            
            GetUserByIdResponse response = userService.getUserById(request);
            
            if (response.isSuccess()) {
                User user = response.getUser();
                System.out.println("\n=== User Details ===");
                System.out.println("ID: " + user.getId());
                System.out.println("Username: " + user.getUsername());
                System.out.println("Email: " + user.getEmail());
                System.out.println("Role: " + user.getRole());
                System.out.println("Created: " + user.getCreatedAt());
                System.out.println("Updated: " + user.getUpdatedAt());
            } else {
                System.err.println("Error getting user: " + response.getError());
            }
        } catch (Exception e) {
            logger.error("Error getting user by ID", e);
            System.err.println("Get user failed: " + e.getMessage());
        }
    }
    
    /**
     * Add new user
     */
    public void addUser(String username, String email, String password, String role) {
        if (!isServiceAvailable()) {
            System.err.println("SOAP service is not available. Please ensure the server is running.");
            return;
        }
        
        if (!isAuthenticated()) {
            System.err.println("Error: Not authenticated. Please log in first.");
            return;
        }
        
        try {
            AddUserRequest request = new AddUserRequest();
            request.setToken(authToken);
            request.setUsername(username);
            request.setEmail(email);
            request.setPassword(password);
            request.setRole(role);
            
            AddUserResponse response = userService.addUser(request);
            
            if (response.isSuccess()) {
                User user = response.getUser();
                System.out.println("User added successfully!");
                System.out.println("ID: " + user.getId());
                System.out.println("Username: " + user.getUsername());
                System.out.println("Email: " + user.getEmail());
                System.out.println("Role: " + user.getRole());
            } else {
                System.err.println("Error adding user: " + response.getError());
            }
        } catch (Exception e) {
            logger.error("Error adding user", e);
            System.err.println("Add user failed: " + e.getMessage());
        }
    }
    
    /**
     * Update user
     */
    public void updateUser(String userId, String username, String email, String password, String role) {
        if (!isServiceAvailable()) {
            System.err.println("SOAP service is not available. Please ensure the server is running.");
            return;
        }
        
        if (!isAuthenticated()) {
            System.err.println("Error: Not authenticated. Please log in first.");
            return;
        }
        
        try {
            UpdateUserRequest request = new UpdateUserRequest();
            request.setToken(authToken);
            request.setUserId(userId);
            request.setUsername(username);
            request.setEmail(email);
            if (password != null && !password.trim().isEmpty()) {
                request.setPassword(password);
            }
            request.setRole(role);
            
            UpdateUserResponse response = userService.updateUser(request);
            
            if (response.isSuccess()) {
                User user = response.getUser();
                System.out.println("User updated successfully!");
                System.out.println("ID: " + user.getId());
                System.out.println("Username: " + user.getUsername());
                System.out.println("Email: " + user.getEmail());
                System.out.println("Role: " + user.getRole());
            } else {
                System.err.println("Error updating user: " + response.getError());
            }
        } catch (Exception e) {
            logger.error("Error updating user", e);
            System.err.println("Update user failed: " + e.getMessage());
        }
    }
    
    /**
     * Delete user
     */
    public void deleteUser(String userId) {
        if (!isServiceAvailable()) {
            System.err.println("SOAP service is not available. Please ensure the server is running.");
            return;
        }
        
        if (!isAuthenticated()) {
            System.err.println("Error: Not authenticated. Please log in first.");
            return;
        }
        
        try {
            DeleteUserRequest request = new DeleteUserRequest();
            request.setToken(authToken);
            request.setUserId(userId);
            
            DeleteUserResponse response = userService.deleteUser(request);
            
            if (response.isSuccess()) {
                System.out.println("User deleted successfully!");
            } else {
                System.err.println("Error deleting user: " + response.getError());
            }
        } catch (Exception e) {
            logger.error("Error deleting user", e);
            System.err.println("Delete user failed: " + e.getMessage());
        }
    }
    
    /**
     * Check if user is authenticated
     */
    public boolean isAuthenticated() {
        return authToken != null && !authToken.trim().isEmpty();
    }
    
    /**
     * Get current auth token
     */
    public String getAuthToken() {
        return authToken;
    }
    
    /**
     * Logout user
     */
    public void logout() {
        this.authToken = null;
        System.out.println("Logged out successfully.");
    }
}