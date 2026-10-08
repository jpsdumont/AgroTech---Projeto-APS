package com.agrotech.cadastros.controller;

import com.agrotech.cadastros.dto.LoteRequest;
import com.agrotech.cadastros.dto.LoteResponse;
import com.agrotech.cadastros.service.LoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LoteController {

    private final LoteService loteService;

    public LoteController(LoteService loteService) {
        this.loteService = loteService;
    }

    /** POST /fazendas/{fazendaId}/lotes — Cria lote dentro de uma fazenda. */
    @PostMapping("/fazendas/{fazendaId}/lotes")
    public ResponseEntity<LoteResponse> criar(
            @PathVariable Long fazendaId,
            @Valid @RequestBody LoteRequest request) {
        // Garante que o fazendaId da URL prevalece sobre o do body
        request.setFazendaId(fazendaId);
        LoteResponse response = loteService.criar(fazendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** GET /fazendas/{fazendaId}/lotes — Lista lotes de uma fazenda. */
    @GetMapping("/fazendas/{fazendaId}/lotes")
    public ResponseEntity<List<LoteResponse>> listarPorFazenda(
            @PathVariable Long fazendaId) {
        return ResponseEntity.ok(loteService.listarPorFazenda(fazendaId));
    }

    /** GET /lotes/{id} — Detalhe de um lote. */
    @GetMapping("/lotes/{id}")
    public ResponseEntity<LoteResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(loteService.buscarPorId(id));
    }

    /** PUT /lotes/{id} — Atualiza um lote. */
    @PutMapping("/lotes/{id}")
    public ResponseEntity<LoteResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody LoteRequest request) {
        return ResponseEntity.ok(loteService.atualizar(id, request));
    }

    /** DELETE /lotes/{id} — Remove um lote. */
    @DeleteMapping("/lotes/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        loteService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
