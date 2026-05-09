### Stage 1: Build frontend ###
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY frontend-biolens/package.json frontend-biolens/package-lock.json ./

RUN npm ci

COPY frontend-biolens/ ./

RUN npm run build


### Stage 2: Build backend ###
FROM maven:3.9.9-eclipse-temurin-17 AS backend-build

WORKDIR /backend

COPY backendBioLense/pom.xml ./
RUN mvn dependency:go-offline -B

COPY backendBioLense/ ./
RUN mvn clean package -DskipTests


### Stage 3: Runtime ###
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openjdk17-jre

ENV NODE_ENV=production
ENV BACKEND_PORT=8080
ENV FRONTEND_PORT=3000

COPY --from=backend-build /backend/target/*.jar /app/backend.jar

### IMPORTANT: copy ONLY built frontend
COPY --from=frontend-build /frontend/.next /app/frontend/.next
COPY --from=frontend-build /frontend/public /app/frontend/public
COPY --from=frontend-build /frontend/package.json /app/frontend/package.json

WORKDIR /app

EXPOSE 8080
EXPOSE 3000

CMD ["sh", "-c", "java -jar /app/backend.jar --server.port=${BACKEND_PORT} & cd /app/frontend && npm start -- --port ${FRONTEND_PORT}"]
