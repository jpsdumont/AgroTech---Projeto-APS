package com.agrotech.cadastros.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Erros de validação de Bean Validation (@Valid) — retorna 400 com campo por campo.
     *
     * Exemplo de resposta:
     * {
     *   "status": 400,
     *   "timestamp": "...",
     *   "erros": {
     *     "email": "E-mail inválido",
     *     "senha": "Senha deve ter no mínimo 6 caracteres"
     *   }
     * }
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> erros = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            erros.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("erros", erros);

        return ResponseEntity.badRequest().body(body);
    }

    /**
     * ResponseStatusException lançada pelos services — repassa o status HTTP e a mensagem.
     *
     * Exemplo de resposta:
     * {
     *   "status": 409,
     *   "timestamp": "...",
     *   "mensagem": "E-mail já cadastrado"
     * }
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(
            ResponseStatusException ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("status", ex.getStatusCode().value());
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("mensagem", ex.getReason());

        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }

    /**
     * Fallback para exceções não tratadas — retorna 500 genérico.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("mensagem", "Erro interno no servidor");

        return ResponseEntity.internalServerError().body(body);
    }
}
