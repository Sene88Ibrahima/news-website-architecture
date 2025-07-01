package com.newswebsite.client;

import com.newswebsite.client.soap.SoapClient;

import java.util.Scanner;

public class InteractiveSession {

    private final SoapClient soapClient;
    private String authToken;

    public InteractiveSession(String soapServiceUrl) {
        this.soapClient = new SoapClient(soapServiceUrl);
    }

    public void start() throws Exception {
        System.out.println("--- News Website Admin Client ---");

        if (!authenticate()) {
            System.out.println("Authentication failed. Access denied.");
            return;
        }

        System.out.println("Authentication successful. Welcome, Admin!");
        mainMenu();
    }

    private boolean authenticate() throws Exception {
        Scanner scanner = new Scanner(System.in);
        
        while (true) {
            System.out.print("Username: ");
            String username = scanner.nextLine();
            System.out.print("Password: ");
            String password = scanner.nextLine();

            // Call the SOAP authentication service
            boolean authResult = soapClient.authenticateUser(username, password);
            
            if (authResult) {
                // Authentication successful, get the token from SoapClient
                this.authToken = soapClient.getAuthToken();
                return true;
            } else {
                // Authentication failed, ask if user wants to try again
                System.out.print("\nAuthentication failed. Try again? (y/n): ");
                String retry = scanner.nextLine().trim().toLowerCase();
                if (!retry.equals("y") && !retry.equals("yes")) {
                    return false;
                }
                System.out.println();
            }
        }
    }

    private void mainMenu() throws Exception {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("\n--- Admin Menu ---");
            System.out.println("1. List Users");
            System.out.println("2. Add User");
            System.out.println("3. Update User");
            System.out.println("4. Delete User");
            System.out.println("5. Exit");
            System.out.print("Choose an option: ");

            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1: // List Users
                    System.out.print("Page (default 1): ");
                    int page = scanner.nextInt();
                    System.out.print("Limit (default 10): ");
                    int limit = scanner.nextInt();
                    scanner.nextLine(); // Consume newline
                    soapClient.getUsers(page, limit, null);
                    break;
                case 2: // Add User
                    System.out.print("Username: ");
                    String newUsername = scanner.nextLine();
                    System.out.print("Email: ");
                    String newEmail = scanner.nextLine();
                    System.out.print("Password: ");
                    String newPassword = scanner.nextLine();
                    System.out.print("Role (VISITOR, EDITOR, ADMIN): ");
                    String newRole = scanner.nextLine();
                    soapClient.addUser(newUsername, newEmail, newPassword, newRole);
                    break;
                case 3: // Update User
                    System.out.print("User ID to update: ");
                    String userIdToUpdate = scanner.nextLine();
                    System.out.print("New Username (leave blank to keep current): ");
                    String updatedUsername = scanner.nextLine();
                    System.out.print("New Email (leave blank to keep current): ");
                    String updatedEmail = scanner.nextLine();
                    System.out.print("New Password (leave blank to keep current): ");
                    String updatedPassword = scanner.nextLine();
                    System.out.print("New Role (leave blank to keep current): ");
                    String updatedRole = scanner.nextLine();
                    soapClient.updateUser(userIdToUpdate, updatedUsername, updatedEmail, updatedPassword, updatedRole);
                    break;
                case 4: // Delete User
                    System.out.print("User ID to delete: ");
                    String userIdToDelete = scanner.nextLine();
                    soapClient.deleteUser(userIdToDelete);
                    break;
                case 5:
                    System.out.println("Exiting.");
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }
}