# News Website Java Client

A command-line Java client application for managing users via the News Website SOAP service.

## Features

- **SOAP Client**: User management and authentication operations
- **Command-line Interface**: Easy-to-use CLI with comprehensive help

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- Running News Website SOAP service on `http://localhost:8080/soap`

## Building the Application

1. Navigate to the java-client directory:
   ```bash
   cd java-client
   ```

2. Build the application:
   ```bash
   mvn clean compile
   ```

3. Create executable JAR:
   ```bash
   mvn package
   ```

## Running the Application

### Using Maven
```bash
mvn exec:java -Dexec.mainClass="com.newswebsite.client.NewsClientApplication" -Dexec.args="--help"
```

### Using the JAR file
```bash
java -jar target/news-client-1.0.0.jar --help
```

## Usage Examples

### SOAP API Operations

#### Authentication

**Login and get token:**
```bash
java -jar target/news-client-1.0.0.jar soap auth login --username admin --password password
```

#### User Management

**List users (requires admin token):**
```bash
java -jar target/news-client-1.0.0.jar soap users list --token "your-jwt-token-here"
```

**List users with pagination:**
```bash
java -jar target/news-client-1.0.0.jar soap users list --token "your-jwt-token-here" --page 1 --limit 5
```

**Filter users by role:**
```bash
java -jar target/news-client-1.0.0.jar soap users list --token "your-jwt-token-here" --role "ADMIN"
```

**Get specific user:**
```bash
java -jar target/news-client-1.0.0.jar soap users get 123 --token "your-jwt-token-here"
```

**Add new user:**
```bash
java -jar target/news-client-1.0.0.jar soap users add \
  --username "newuser" \
  --email "newuser@example.com" \
  --password "password123" \
  --role "USER" \
  --token "your-jwt-token-here"
```

**Update user:**
```bash
java -jar target/news-client-1.0.0.jar soap users update 123 \
  --username "updateduser" \
  --email "updated@example.com" \
  --token "your-jwt-token-here"
```

**Delete user:**
```bash
java -jar target/news-client-1.0.0.jar soap users delete 123 --token "your-jwt-token-here"
```

## Configuration

### Service URL

You can customize the SOAP service URL using command-line options:

```bash
java -jar target/news-client-1.0.0.jar soap auth login --service-url "http://localhost:9001/soap" --username admin --password password
```

## Command Structure

```
news-client
└── soap
    ├── auth
    └── users
```

## Error Handling

The client provides detailed error messages for:
- Network connectivity issues
- Authentication failures
- Invalid parameters
- Service unavailability
- SOAP faults

## Development

### Project Structure

```
src/main/java/com/newswebsite/client/
├── NewsClientApplication.java     # Main application entry point
├── commands/
│   ├── RestCommands.java         # REST API command definitions
│   └── SoapCommands.java         # SOAP API command definitions
├── rest/
│   └── RestClient.java           # REST API client implementation
└── soap/
    └── SoapClient.java           # SOAP API client implementation
```

### Dependencies

- **Picocli**: Command-line interface framework
- **OkHttp**: HTTP client for REST operations
- **Jackson**: JSON/XML processing
- **JAX-WS**: SOAP client support
- **SLF4J + Logback**: Logging

### Building from Source

1. Clone the repository
2. Navigate to `java-client` directory
3. Run `mvn clean install`
4. The executable JAR will be in `target/news-client-1.0.0.jar`

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure the REST/SOAP services are running
2. **Authentication failed**: Check username/password for SOAP operations
3. **Invalid token**: Ensure you're using a valid JWT token for protected operations
4. **Permission denied**: Some operations require admin privileges

### Logging

To enable debug logging, add the following JVM argument:
```bash
java -Dlogging.level.com.newswebsite.client=DEBUG -jar target/news-client-1.0.0.jar
```

## License

This project is part of the News Website application suite.