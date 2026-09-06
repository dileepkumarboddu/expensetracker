# Multi-stage Dockerfile for Spring Boot 3 with Java 17

# Stage 1: Build the application
FROM gradle:8.10-jdk17 AS builder
WORKDIR /home/gradle/project

# Copy Gradle configurations first for better layer caching
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# Copy source code
COPY src ./src

# Build production JAR without running tests (tests already verified)
RUN gradle bootJar --no-daemon -x test

# Stage 2: Minimal production runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root system user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built JAR from builder stage
COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar

# Environment defaults
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
