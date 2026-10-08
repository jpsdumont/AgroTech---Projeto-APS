package com.agrotech.cadastros.service;

import com.agrotech.cadastros.dto.FazendaRequest;
import com.agrotech.cadastros.dto.FazendaResponse;
import com.agrotech.cadastros.entity.Fazenda;
import com.agrotech.cadastros.entity.Usuario;
import com.agrotech.cadastros.repository.FazendaRepository;
import com.agrotech.cadastros.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FazendaService {

    private final FazendaRepository fazendaRepository;
    private final UsuarioRepository usuarioRepository;

    public FazendaService(FazendaRepository fazendaRepository,
                          UsuarioRepository usuarioRepository) {
        this.fazendaRepository = fazendaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Cria uma fazenda cujo dono é o usuário autenticado (email do token).
     */
    @Transactional
    public FazendaResponse criar(FazendaRequest request, String emailDono) {
        Usuario dono = buscarUsuarioPorEmail(emailDono);

        Fazenda fazenda = Fazenda.builder()
                .nome(request.getNome())
                .localizacao(request.getLocalizacao())
                .dono(dono)
                .build();

        return new FazendaResponse(fazendaRepository.save(fazenda));
    }

    /**
     * Lista todas as fazendas do usuário autenticado.
     */
    @Transactional(readOnly = true)
    public List<FazendaResponse> listar(String emailDono) {
        Usuario dono = buscarUsuarioPorEmail(emailDono);
        return fazendaRepository.findByDonoId(dono.getId())
                .stream()
                .map(FazendaResponse::new)
                .toList();
    }

    /**
     * Retorna o detalhe de uma fazenda. Qualquer usuário autenticado pode ver.
     */
    @Transactional(readOnly = true)
    public FazendaResponse buscarPorId(Long id) {
        return new FazendaResponse(encontrarOuLancar(id));
    }

    /**
     * Atualiza os dados de uma fazenda.
     */
    @Transactional
    public FazendaResponse atualizar(Long id, FazendaRequest request) {
        Fazenda fazenda = encontrarOuLancar(id);
        fazenda.setNome(request.getNome());
        fazenda.setLocalizacao(request.getLocalizacao());
        return new FazendaResponse(fazendaRepository.save(fazenda));
    }

    /**
     * Remove uma fazenda (e seus lotes em cascata via CascadeType.ALL).
     */
    @Transactional
    public void remover(Long id) {
        Fazenda fazenda = encontrarOuLancar(id);
        fazendaRepository.delete(fazenda);
    }

    // -------------------------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------------------------

    private Fazenda encontrarOuLancar(Long id) {
        return fazendaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Fazenda não encontrada: " + id));
    }

    private Usuario buscarUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));
    }
}
