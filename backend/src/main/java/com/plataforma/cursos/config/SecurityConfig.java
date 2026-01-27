package com.plataforma.cursos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuração de segurança do Spring Security.
 * 
 * Por padrão, o Spring Security bloqueia TODAS as requisições.
 * Esta configuração permite acesso público aos endpoints de health e ping.
 * 
 * No Bloco 1, desabilitamos a segurança para facilitar o aprendizado.
 * Nos próximos blocos, vamos implementar autenticação JWT.
 * 
 * Analogia Python: É como configurar CORS ou middleware de autenticação
 * no Flask/FastAPI, mas usando uma DSL (Domain Specific Language) do Spring.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita CSRF para APIs REST (não precisamos de tokens CSRF)
            .csrf(csrf -> csrf.disable())
            // Configura as regras de autorização
            .authorizeHttpRequests(auth -> auth
                // Permite acesso público ao Actuator (health checks)
                .requestMatchers("/actuator/**").permitAll()
                // Permite acesso público aos endpoints de API básicos
                .requestMatchers("/api/v1/ping").permitAll()
                // Todas as outras requisições precisam de autenticação (por enquanto bloqueadas)
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}
