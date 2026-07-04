FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN apk add --no-cache curl && \
    addgroup -S spring && adduser -S spring -G spring && \
    mkdir -p /videos/UniversoNarrado && \
    chown -R spring:spring /videos
USER spring:spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8734

ENTRYPOINT ["java", "-jar", "app.jar"]
