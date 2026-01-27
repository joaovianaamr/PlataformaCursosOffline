package com.plataforma.cursos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controller responsável por endpoints de teste/ping.
 * 
 * Este controller demonstra o básico de um endpoint REST no Spring Boot:
 * - @RestController: Marca a classe como um controller REST (retorna JSON automaticamente)
 * - @RequestMapping: Define o prefixo comum para todos os endpoints desta classe
 * - @GetMapping: Define um endpoint que responde a requisições HTTP GET
 * 
 * Analogia Python: É como criar uma rota Flask:
 *   @app.route('/api/v1/ping', methods=['GET'])
 *   def ping():
 *       return jsonify({"status": "ok", "message": "pong"})
 */
@RestController
@RequestMapping("/api/v1")
public class PingController {

    /**
     * Endpoint de ping para verificar se a API está funcionando.
     * 
     * @return Map com status e mensagem (convertido automaticamente para JSON)
     */
    @GetMapping("/ping")
    public Map<String, String> ping() {
        return Map.of(
            "status", "ok",
            "message", "pong"
        );
    }
}
