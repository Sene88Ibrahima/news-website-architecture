package com.newswebsite.client.gui;

import com.newswebsite.client.gui.SoapClientService;
import com.newswebsite.client.soap.generated.User;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.VBox;

import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;

/**
 * Contrôleur pour l'interface de gestion des utilisateurs
 */
public class UserManagementController implements Initializable {
    
    @FXML private TextField usernameField;
    @FXML private PasswordField passwordField;
    @FXML private Button loginButton;
    @FXML private Button logoutButton;
    @FXML private Label statusLabel;
    
    @FXML private VBox userManagementPane;
    @FXML private TableView<User> usersTable;
    @FXML private TableColumn<User, String> idColumn;
    @FXML private TableColumn<User, String> usernameColumn;
    @FXML private TableColumn<User, String> emailColumn;
    @FXML private TableColumn<User, String> roleColumn;
    @FXML private TableColumn<User, String> createdColumn;
    
    @FXML private TextField newUsernameField;
    @FXML private TextField newEmailField;
    @FXML private PasswordField newPasswordField;
    @FXML private ComboBox<String> newRoleCombo;
    @FXML private Button addUserButton;
    
    @FXML private TextField editUsernameField;
    @FXML private TextField editEmailField;
    @FXML private PasswordField editPasswordField;
    @FXML private ComboBox<String> editRoleCombo;
    @FXML private Button updateUserButton;
    @FXML private Button deleteUserButton;
    
    @FXML private TextField pageField;
    @FXML private TextField limitField;
    @FXML private ComboBox<String> roleFilterCombo;
    @FXML private Button refreshButton;
    
    private SoapClientService soapClient;
    private ObservableList<User> usersList;
    private User selectedUser;
    
    @Override
    public void initialize(URL location, ResourceBundle resources) {
        soapClient = new SoapClientService();
        usersList = FXCollections.observableArrayList();
        
        // Configuration de la table
        setupTable();
        
        // Configuration des ComboBox
        setupComboBoxes();
        
        // Configuration des événements
        setupEventHandlers();
        
        // État initial
        userManagementPane.setDisable(true);
        logoutButton.setDisable(true);
        
        // Valeurs par défaut
        pageField.setText("1");
        limitField.setText("10");
    }
    
    private void setupTable() {
        idColumn.setCellValueFactory(new PropertyValueFactory<>("id"));
        usernameColumn.setCellValueFactory(new PropertyValueFactory<>("username"));
        emailColumn.setCellValueFactory(new PropertyValueFactory<>("email"));
        roleColumn.setCellValueFactory(new PropertyValueFactory<>("role"));
        createdColumn.setCellValueFactory(new PropertyValueFactory<>("createdAt"));
        
        usersTable.setItems(usersList);
        
        // Sélection d'utilisateur
        usersTable.getSelectionModel().selectedItemProperty().addListener((obs, oldSelection, newSelection) -> {
            selectedUser = newSelection;
            if (selectedUser != null) {
                editUsernameField.setText(selectedUser.getUsername());
                editEmailField.setText(selectedUser.getEmail());
                editPasswordField.setText("");
                editRoleCombo.setValue(selectedUser.getRole());
                updateUserButton.setDisable(false);
                deleteUserButton.setDisable(false);
            } else {
                clearEditFields();
                updateUserButton.setDisable(true);
                deleteUserButton.setDisable(true);
            }
        });
    }
    
    private void setupComboBoxes() {
        ObservableList<String> roles = FXCollections.observableArrayList("VISITOR", "EDITOR", "ADMIN");
        newRoleCombo.setItems(roles);
        editRoleCombo.setItems(roles);
        
        ObservableList<String> roleFilters = FXCollections.observableArrayList("", "VISITOR", "EDITOR", "ADMIN");
        roleFilterCombo.setItems(roleFilters);
        
        newRoleCombo.setValue("VISITOR");
        roleFilterCombo.setValue("");
    }
    
    private void setupEventHandlers() {
        loginButton.setOnAction(e -> login());
        logoutButton.setOnAction(e -> logout());
        addUserButton.setOnAction(e -> addUser());
        updateUserButton.setOnAction(e -> updateUser());
        deleteUserButton.setOnAction(e -> deleteUser());
        refreshButton.setOnAction(e -> loadUsers());
    }
    
    @FXML
    private void login() {
        String username = usernameField.getText().trim();
        String password = passwordField.getText();
        
        if (username.isEmpty() || password.isEmpty()) {
            showAlert("Erreur", "Veuillez saisir le nom d'utilisateur et le mot de passe.");
            return;
        }
        
        Task<Boolean> loginTask = new Task<Boolean>() {
            @Override
            protected Boolean call() throws Exception {
                Platform.runLater(() -> {
                    loginButton.setDisable(true);
                    statusLabel.setText("Connexion en cours...");
                });
                
                return soapClient.authenticate(username, password);
            }
            
            @Override
            protected void succeeded() {
                Boolean success = getValue();
                Platform.runLater(() -> {
                    if (success) {
                        statusLabel.setText("Connecté en tant que: " + username);
                        userManagementPane.setDisable(false);
                        loginButton.setDisable(true);
                        logoutButton.setDisable(false);
                        usernameField.setDisable(true);
                        passwordField.setDisable(true);
                        loadUsers();
                    } else {
                        statusLabel.setText("Échec de la connexion");
                        loginButton.setDisable(false);
                    }
                });
            }
            
            @Override
            protected void failed() {
                Platform.runLater(() -> {
                    statusLabel.setText("Erreur de connexion");
                    loginButton.setDisable(false);
                    showAlert("Erreur", "Erreur lors de la connexion: " + getException().getMessage());
                });
            }
        };
        
        new Thread(loginTask).start();
    }
    
    @FXML
    private void logout() {
        soapClient.logout();
        statusLabel.setText("Déconnecté");
        userManagementPane.setDisable(true);
        loginButton.setDisable(false);
        logoutButton.setDisable(true);
        usernameField.setDisable(false);
        passwordField.setDisable(false);
        usernameField.clear();
        passwordField.clear();
        usersList.clear();
        clearEditFields();
    }
    
    @FXML
    private void loadUsers() {
        Task<SoapClientService.UsersResult> loadTask = new Task<SoapClientService.UsersResult>() {
            @Override
            protected SoapClientService.UsersResult call() throws Exception {
                Platform.runLater(() -> {
                    refreshButton.setDisable(true);
                    statusLabel.setText("Chargement des utilisateurs...");
                });
                
                int page = Integer.parseInt(pageField.getText());
                int limit = Integer.parseInt(limitField.getText());
                String roleFilter = roleFilterCombo.getValue();
                
                return soapClient.getUsersForGUI(page, limit, roleFilter);
            }
            
            @Override
            protected void succeeded() {
                SoapClientService.UsersResult result = getValue();
                Platform.runLater(() -> {
                    refreshButton.setDisable(false);
                    if (result.isSuccess()) {
                        usersList.clear();
                        usersList.addAll(result.getUsers());
                        statusLabel.setText("Utilisateurs chargés (" + result.getTotal() + " total)");
                    } else {
                        statusLabel.setText("Erreur lors du chargement");
                        showAlert("Erreur", result.getError());
                    }
                });
            }
            
            @Override
            protected void failed() {
                Platform.runLater(() -> {
                    refreshButton.setDisable(false);
                    statusLabel.setText("Erreur lors du chargement");
                    showAlert("Erreur", "Erreur lors du chargement: " + getException().getMessage());
                });
            }
        };
        
        new Thread(loadTask).start();
    }
    
    @FXML
    private void addUser() {
        String username = newUsernameField.getText().trim();
        String email = newEmailField.getText().trim();
        String password = newPasswordField.getText();
        String role = newRoleCombo.getValue();
        
        if (username.isEmpty() || email.isEmpty() || password.isEmpty() || role == null) {
            showAlert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        
        Task<SoapClientService.UserResult> addTask = new Task<SoapClientService.UserResult>() {
            @Override
            protected SoapClientService.UserResult call() throws Exception {
                Platform.runLater(() -> {
                    addUserButton.setDisable(true);
                    statusLabel.setText("Ajout de l'utilisateur...");
                });
                
                return soapClient.addUserForGUI(username, email, password, role);
            }
            
            @Override
            protected void succeeded() {
                SoapClientService.UserResult result = getValue();
                Platform.runLater(() -> {
                    addUserButton.setDisable(false);
                    if (result.isSuccess()) {
                        statusLabel.setText("Utilisateur ajouté avec succès");
                        clearNewUserFields();
                        loadUsers();
                    } else {
                        statusLabel.setText("Erreur lors de l'ajout");
                        showAlert("Erreur", result.getError());
                    }
                });
            }
            
            @Override
            protected void failed() {
                Platform.runLater(() -> {
                    addUserButton.setDisable(false);
                    statusLabel.setText("Erreur lors de l'ajout");
                    showAlert("Erreur", "Erreur lors de l'ajout: " + getException().getMessage());
                });
            }
        };
        
        new Thread(addTask).start();
    }
    
    @FXML
    private void updateUser() {
        if (selectedUser == null) {
            showAlert("Erreur", "Veuillez sélectionner un utilisateur à modifier.");
            return;
        }
        
        String username = editUsernameField.getText().trim();
        String email = editEmailField.getText().trim();
        String password = editPasswordField.getText();
        String role = editRoleCombo.getValue();
        
        if (username.isEmpty() || email.isEmpty() || role == null) {
            showAlert("Erreur", "Veuillez remplir tous les champs obligatoires.");
            return;
        }
        
        Task<SoapClientService.UserResult> updateTask = new Task<SoapClientService.UserResult>() {
            @Override
            protected SoapClientService.UserResult call() throws Exception {
                Platform.runLater(() -> {
                    updateUserButton.setDisable(true);
                    statusLabel.setText("Mise à jour de l'utilisateur...");
                });
                
                return soapClient.updateUserForGUI(selectedUser.getId(), username, email, password, role);
            }
            
            @Override
            protected void succeeded() {
                SoapClientService.UserResult result = getValue();
                Platform.runLater(() -> {
                    updateUserButton.setDisable(false);
                    if (result.isSuccess()) {
                        statusLabel.setText("Utilisateur mis à jour avec succès");
                        loadUsers();
                    } else {
                        statusLabel.setText("Erreur lors de la mise à jour");
                        showAlert("Erreur", result.getError());
                    }
                });
            }
            
            @Override
            protected void failed() {
                Platform.runLater(() -> {
                    updateUserButton.setDisable(false);
                    statusLabel.setText("Erreur lors de la mise à jour");
                    showAlert("Erreur", "Erreur lors de la mise à jour: " + getException().getMessage());
                });
            }
        };
        
        new Thread(updateTask).start();
    }
    
    @FXML
    private void deleteUser() {
        if (selectedUser == null) {
            showAlert("Erreur", "Veuillez sélectionner un utilisateur à supprimer.");
            return;
        }
        
        Alert confirmAlert = new Alert(Alert.AlertType.CONFIRMATION);
        confirmAlert.setTitle("Confirmation");
        confirmAlert.setHeaderText("Supprimer l'utilisateur");
        confirmAlert.setContentText("Êtes-vous sûr de vouloir supprimer l'utilisateur \"" + selectedUser.getUsername() + "\" ?");
        
        Optional<ButtonType> result = confirmAlert.showAndWait();
        if (result.isPresent() && result.get() == ButtonType.OK) {
            Task<SoapClientService.DeleteResult> deleteTask = new Task<SoapClientService.DeleteResult>() {
                @Override
                protected SoapClientService.DeleteResult call() throws Exception {
                    Platform.runLater(() -> {
                        deleteUserButton.setDisable(true);
                        statusLabel.setText("Suppression de l'utilisateur...");
                    });
                    
                    return soapClient.deleteUserForGUI(selectedUser.getId());
                }
                
                @Override
                protected void succeeded() {
                    SoapClientService.DeleteResult deleteResult = getValue();
                    Platform.runLater(() -> {
                        deleteUserButton.setDisable(false);
                        if (deleteResult.isSuccess()) {
                            statusLabel.setText("Utilisateur supprimé avec succès");
                            clearEditFields();
                            loadUsers();
                        } else {
                            statusLabel.setText("Erreur lors de la suppression");
                            showAlert("Erreur", deleteResult.getError());
                        }
                    });
                }
                
                @Override
                protected void failed() {
                    Platform.runLater(() -> {
                        deleteUserButton.setDisable(false);
                        statusLabel.setText("Erreur lors de la suppression");
                        showAlert("Erreur", "Erreur lors de la suppression: " + getException().getMessage());
                    });
                }
            };
            
            new Thread(deleteTask).start();
        }
    }
    
    private void clearNewUserFields() {
        newUsernameField.clear();
        newEmailField.clear();
        newPasswordField.clear();
        newRoleCombo.setValue("VISITOR");
    }
    
    private void clearEditFields() {
        editUsernameField.clear();
        editEmailField.clear();
        editPasswordField.clear();
        editRoleCombo.setValue(null);
    }
    
    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}