package com.plataforma.cursos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação Spring Boot.
 * 
 * Esta classe é o ponto de entrada da aplicação. A anotação @SpringBootApplication
 * configura automaticamente:
 * - Component scanning (procura por @RestController, @Service, @Repository, etc)
 * - Auto-configuração (configura datasource, JPA, etc baseado nas dependências)
 * - Configuração de propriedades (lê application.yml)
 * 
 * Analogia Python: É como o "if __name__ == '__main__': app.run()" do Flask,
 * mas muito mais poderoso e automático.
 */
@SpringBootApplication
public class PlataformaCursosApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlataformaCursosApplication.class, args);
    }
}
