# Use OpenJDK base image with Java 11
FROM openjdk:17-jre-slim

# Set working directory inside the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/chatServer-0.0.1-SNAPSHOT.jar /app/chatServer.jar

# Expose the default port (8081)
EXPOSE 8081

# Command to run the application
CMD ["java", "-jar", "chatServer.jar"]
