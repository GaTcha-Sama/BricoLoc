# Stage 1 : build Maven
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B || true
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2 : image d'exécution
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN adduser -D appuser
USER appuser

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 7000
ENTRYPOINT ["java", "-jar", "app.jar"]
