package com.newswebsite.client.gui;

import com.newswebsite.client.soap.SoapClient;
import com.newswebsite.client.soap.generated.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * Service SOAP adapté pour l'interface graphique
 * Étend SoapClient pour retourner les données au lieu de les afficher dans la console
 */
public class SoapClientService extends SoapClient {
    
    private static final Logger logger = LoggerFactory.getLogger(SoapClientService.class);
    
    /**
     * Classe pour encapsuler la réponse de getUsersForGUI
     */
    public static class UsersResult {
        private final boolean success;
        private final List<User> users;
        private final int total;
        private final int page;
        private final int limit;
        private final String error;
        
        public UsersResult(boolean success, List<User> users, int total, int page, int limit, String error) {
            this.success = success;
            this.users = users;
            this.total = total;
            this.page = page;
            this.limit = limit;
            this.error = error;
        }
        
        public boolean isSuccess() { return success; }
        public List<User> getUsers() { return users; }
        public int getTotal() { return total; }
        public int getPage() { return page; }
        public int getLimit() { return limit; }
        public String getError() { return error; }
    }
    
    /**
     * Classe pour encapsuler la réponse des opérations sur un utilisateur
     */
    public static class UserResult {
        private final boolean success;
        private final User user;
        private final String error;
        
        public UserResult(boolean success, User user, String error) {
            this.success = success;
            this.user = user;
            this.error = error;
        }
        
        public boolean isSuccess() { return success; }
        public User getUser() { return user; }
        public String getError() { return error; }
    }
    
    /**
     * Classe pour encapsuler la réponse des opérations de suppression
     */
    public static class DeleteResult {
        private final boolean success;
        private final String error;
        
        public DeleteResult(boolean success, String error) {
            this.success = success;
            this.error = error;
        }
        
        public boolean isSuccess() { return success; }
        public String getError() { return error; }
    }
    
    /**
     * Récupère la liste des utilisateurs pour l'interface graphique
     */
    public UsersResult getUsersForGUI(int page, int limit, String role) {
        if (!isServiceAvailable()) {
            return new UsersResult(false, null, 0, 0, 0, "Service SOAP non disponible. Veuillez vous assurer que le serveur est en cours d'exécution.");
        }
        
        if (!isAuthenticated()) {
            return new UsersResult(false, null, 0, 0, 0, "Non authentifié. Veuillez vous connecter d'abord.");
        }
        
        try {
            GetUsersRequest request = new GetUsersRequest();
            request.setToken(getAuthToken());
            request.setPage(page);
            request.setLimit(limit);
            if (role != null && !role.trim().isEmpty()) {
                request.setRole(role);
            }
            
            GetUsersResponse response = userService.getUsers(request);
            
            if (response.isSuccess()) {
                return new UsersResult(true, response.getUsers(), response.getTotal(), 
                                     response.getPage(), response.getLimit(), null);
            } else {
                return new UsersResult(false, null, 0, 0, 0, response.getError());
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des utilisateurs", e);
            return new UsersResult(false, null, 0, 0, 0, "Erreur: " + e.getMessage());
        }
    }
    
    /**
     * Récupère un utilisateur par ID pour l'interface graphique
     */
    public UserResult getUserByIdForGUI(String userId) {
        if (!isServiceAvailable()) {
            return new UserResult(false, null, "Service SOAP non disponible. Veuillez vous assurer que le serveur est en cours d'exécution.");
        }
        
        if (!isAuthenticated()) {
            return new UserResult(false, null, "Non authentifié. Veuillez vous connecter d'abord.");
        }
        
        try {
            GetUserByIdRequest request = new GetUserByIdRequest();
            request.setToken(getAuthToken());
            request.setUserId(userId);
            
            GetUserByIdResponse response = userService.getUserById(request);
            
            if (response.isSuccess()) {
                return new UserResult(true, response.getUser(), null);
            } else {
                return new UserResult(false, null, response.getError());
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'utilisateur par ID", e);
            return new UserResult(false, null, "Erreur: " + e.getMessage());
        }
    }
    
    /**
     * Ajoute un nouvel utilisateur pour l'interface graphique
     */
    public UserResult addUserForGUI(String username, String email, String password, String role) {
        if (!isServiceAvailable()) {
            return new UserResult(false, null, "Service SOAP non disponible. Veuillez vous assurer que le serveur est en cours d'exécution.");
        }
        
        if (!isAuthenticated()) {
            return new UserResult(false, null, "Non authentifié. Veuillez vous connecter d'abord.");
        }
        
        try {
            AddUserRequest request = new AddUserRequest();
            request.setToken(getAuthToken());
            request.setUsername(username);
            request.setEmail(email);
            request.setPassword(password);
            request.setRole(role);
            
            AddUserResponse response = userService.addUser(request);
            
            if (response.isSuccess()) {
                return new UserResult(true, response.getUser(), null);
            } else {
                return new UserResult(false, null, response.getError());
            }
        } catch (Exception e) {
            logger.error("Erreur lors de l'ajout de l'utilisateur", e);
            return new UserResult(false, null, "Erreur: " + e.getMessage());
        }
    }
    
    /**
     * Met à jour un utilisateur pour l'interface graphique
     */
    public UserResult updateUserForGUI(String userId, String username, String email, String password, String role) {
        if (!isServiceAvailable()) {
            return new UserResult(false, null, "Service SOAP non disponible. Veuillez vous assurer que le serveur est en cours d'exécution.");
        }
        
        if (!isAuthenticated()) {
            return new UserResult(false, null, "Non authentifié. Veuillez vous connecter d'abord.");
        }
        
        try {
            UpdateUserRequest request = new UpdateUserRequest();
            request.setToken(getAuthToken());
            request.setUserId(userId);
            request.setUsername(username);
            request.setEmail(email);
            if (password != null && !password.trim().isEmpty()) {
                request.setPassword(password);
            }
            request.setRole(role);
            
            UpdateUserResponse response = userService.updateUser(request);
            
            if (response.isSuccess()) {
                return new UserResult(true, response.getUser(), null);
            } else {
                return new UserResult(false, null, response.getError());
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour de l'utilisateur", e);
            return new UserResult(false, null, "Erreur: " + e.getMessage());
        }
    }
    
    /**
     * Supprime un utilisateur pour l'interface graphique
     */
    public DeleteResult deleteUserForGUI(String userId) {
        if (!isServiceAvailable()) {
            return new DeleteResult(false, "Service SOAP non disponible. Veuillez vous assurer que le serveur est en cours d'exécution.");
        }
        
        if (!isAuthenticated()) {
            return new DeleteResult(false, "Non authentifié. Veuillez vous connecter d'abord.");
        }
        
        try {
            DeleteUserRequest request = new DeleteUserRequest();
            request.setToken(getAuthToken());
            request.setUserId(userId);
            
            DeleteUserResponse response = userService.deleteUser(request);
            
            if (response.isSuccess()) {
                return new DeleteResult(true, null);
            } else {
                return new DeleteResult(false, response.getError());
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression de l'utilisateur", e);
            return new DeleteResult(false, "Erreur: " + e.getMessage());
        }
    }
}