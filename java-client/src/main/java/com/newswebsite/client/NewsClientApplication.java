package com.newswebsite.client;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class NewsClientApplication {

    private static final String SOAP_URL_PROPERTY = "soap.service.url";
    private static final String DEFAULT_SOAP_URL = "http://localhost:8080/soap";

    public static void main(String[] args) {
        // Load configuration
        Properties props = new Properties();
        try (InputStream input = new FileInputStream("config.properties")) {
            props.load(input);
        } catch (IOException ex) {
            // Ignore if config file not found, use defaults
        }

        String soapServiceUrl = props.getProperty(SOAP_URL_PROPERTY, DEFAULT_SOAP_URL);

        // Start interactive session
        try {
            new InteractiveSession(soapServiceUrl).start();
        } catch (Exception e) {
            System.err.println("Application error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}