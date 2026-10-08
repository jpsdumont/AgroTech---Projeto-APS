package com.agrotech.cadastros.dto;

import com.agrotech.cadastros.entity.Usuario;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UsuarioResponse {

    private final Long id;
    private final String nome;
    private final String email;
    private final LocalDateTime criadoEm;

    public UsuarioResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.criadoEm = usuario.getCriadoEm();
    }
}
