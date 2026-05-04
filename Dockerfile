### Stage 1: Build the frontend ###
FROM node:20.9 AS frontend-build
# Set the working directory inside the container
WORKDIR /frontend
# Copy only package.json and package-lock.json to install dependencies
COPY frontend-biolens/package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the React app's source code to the container
COPY frontend-biolens/ ./
# Build the React application
RUN npm run build

### Stage 2: Build the backend ###
FROM maven:3.8.8-eclipse-temurin-17 AS backend-build
# Set the working directory inside the container
WORKDIR /backend
# Copy the backend's build files
COPY backendBioLense/pom.xml ./
# Resolve dependencies but avoid re-downloading when source files are unchanged
RUN mvn dependency:resolve dependency:resolve-plugins
# Copy the rest of the backend's source code to the container
COPY backendBioLense/ ./
# Package the backend application
RUN mvn package -DskipTests

### Stage 3: Final stage ###
FROM eclipse-temurin:17-jdk-alpine
# Expose backend application port (default for Spring Boot: 8080)
EXPOSE 8080
# Expose frontend application port for serving React build (optional: e.g. 3000 for dev)
EXPOSE 80

# Create directories for both backend and frontend
WORKDIR /app

# Copy the built backend artifacts
COPY --from=backend-build /backend/target/*.jar /app/backend.jar

# Copy built frontend static files
COPY --from=frontend-build /frontend/build /app/frontend

# Environment variables (Optional)
ENV BACKEND_PORT=8080
ENV FRONTEND_PORT=80

# Command to start both backend and serve frontend
CMD ["sh", "-c", "java -jar /app/backend.jar & npx serve -s /app/frontend -l ${FRONTEND_PORT}"]