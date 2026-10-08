package com.agrotech.cadastros.service;

import com.agrotech.cadastros.dto.LoteRequest;
import com.agrotech.cadastros.dto.LoteResponse;
import com.agrotech.cadastros.entity.Fazenda;
import com.agrotech.cadastros.entity.Lote;
import com.agrotech.cadastros.repository.FazendaRepository;
import com.agrotech.cadastros.repository.LoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LoteService {

    private final LoteRepository loteRepository;
    private final FazendaRepository fazendaRepository;

    public LoteService(LoteRepository loteRepository,
                       FazendaRepository fazendaRepository) {
        this.loteRepository = loteRepository;
        this.fazendaRepository = fazendaRepository;
    }

    /**
     * Cria um lote vinculado a uma fazenda existente.
     * Retorna 404 se a fazenda não existir.
     */
    @Transactional
    public LoteResponse criar(Long fazendaId, LoteRequest request) {
        Fazenda fazenda = encontrarFazendaOuLancar(fazendaId);

        Lote lote = Lote.builder()
                .fazenda(fazenda)
                .nome(request.getNome())
                .quantidade(request.getQuantidade())
                .tipo(request.getTipo())
                .pasto(request.getPasto())
                .build();

        return new LoteResponse(loteRepository.save(lote));
    }

    /**
     * Lista todos os lotes de uma fazenda.
     * Retorna 404 se a fazenda não existir.
     */
    @Transactional(readOnly = true)
    public List<LoteResponse> listarPorFazenda(Long fazendaId) {
        encontrarFazendaOuLancar(fazendaId); // valida existência
        return loteRepository.findByFazendaId(fazendaId)
                .stream()
                .map(LoteResponse::new)
                .toList();
    }

    /**
     * Retorna o detalhe de um lote pelo ID.
     */
    @Transactional(readOnly = true)
    public LoteResponse buscarPorId(Long id) {
        return new LoteResponse(encontrarLoteOuLancar(id));
    }

    /**
     * Atualiza os dados de um lote.
     */
    @Transactional
    public LoteResponse atualizar(Long id, LoteRequest request) {
        Lote lote = encontrarLoteOuLancar(id);

        // Permite mover o lote para outra fazenda se fazendaId mudar
        if (!lote.getFazenda().getId().equals(request.getFazendaId())) {
            Fazenda novaFazenda = encontrarFazendaOuLancar(request.getFazendaId());
            lote.setFazenda(novaFazenda);
        }

        lote.setNome(request.getNome());
        lote.setQuantidade(request.getQuantidade());
        lote.setTipo(request.getTipo());
        lote.setPasto(request.getPasto());

        return new LoteResponse(loteRepository.save(lote));
    }

    /**
     * Remove um lote pelo ID.
     */
    @Transactional
    public void remover(Long id) {
        Lote lote = encontrarLoteOuLancar(id);
        loteRepository.delete(lote);
    }

    // -------------------------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------------------------

    private Fazenda encontrarFazendaOuLancar(Long fazendaId) {
        return fazendaRepository.findById(fazendaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Fazenda não encontrada: " + fazendaId));
    }

    private Lote encontrarLoteOuLancar(Long id) {
        return loteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Lote não encontrado: " + id));
    }
}
