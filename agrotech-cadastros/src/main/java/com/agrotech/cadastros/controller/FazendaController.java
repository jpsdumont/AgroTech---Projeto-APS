package com.agrotech.cadastros.controller;

import com.agrotech.cadastros.dto.FazendaRequest;
import com.agrotech.cadastros.dto.FazendaResponse;
import com.agrotech.cadastros.service.FazendaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fazendas")
public class FazendaController {

    private final FazendaService fazendaService;

    public FazendaController(FazendaService fazendaService) {
        this.fazendaService = fazendaService;
    }

    /** POST /fazendas — Cria fazenda; dono é o usuário autenticado. */
    @PostMapping
    public ResponseEntity<FazendaResponse> criar(
            @Valid @RequestBody FazendaRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        FazendaResponse response = fazendaService.criar(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** GET /fazendas — Lista fazendas do usuário autenticado. */
    @GetMapping
    public ResponseEntity<List<FazendaResponse>> listar(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(fazendaService.listar(userDetails.getUsername()));
    }

    /** GET /fazendas/{id} — Detalhe de uma fazenda. */
    @GetMapping("/{id}")
    public ResponseEntity<FazendaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(fazendaService.buscarPorId(id));
    }

    /** PUT /fazendas/{id} — Atualiza nome e localização. */
    @PutMapping("/{id}")
    public ResponseEntity<FazendaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody FazendaRequest request) {
        return ResponseEntity.ok(fazendaService.atualizar(id, request));
    }

    /** DELETE /fazendas/{id} — Remove fazenda e seus lotes em cascata. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        fazendaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
