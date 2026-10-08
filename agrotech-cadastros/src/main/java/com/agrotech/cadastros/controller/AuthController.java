package com.agrotech.cadastros.controller;

import com.agrotech.cadastros.dto.*;
import com.agrotech.cadastros.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /auth/registro
     * Cria uma nova conta. Retorna 201 com os dados do usuário (sem senha).
     */
    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registrar(
            @Valid @RequestBody RegistroRequest request) {
        UsuarioResponse response = authService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /auth/login
     * Autentica e retorna um JWT. Retorna 200 com o token.
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(
            @Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /auth/me
     * Retorna os dados do usuário autenticado. Exige JWT válido.
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(
            @AuthenticationPrincipal UserDetails userDetails) {
        UsuarioResponse response = authService.buscarPorEmail(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
