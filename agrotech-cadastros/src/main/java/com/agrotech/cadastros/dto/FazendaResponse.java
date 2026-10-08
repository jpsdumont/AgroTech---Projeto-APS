package com.agrotech.cadastros.dto;

import com.agrotech.cadastros.entity.Fazenda;
import lombok.Getter;

@Getter
public class FazendaResponse {

    private final Long id;
    private final String nome;
    private final String localizacao;
    private final int totalLotes;

    public FazendaResponse(Fazenda fazenda) {
        this.id = fazenda.getId();
        this.nome = fazenda.getNome();
        this.localizacao = fazenda.getLocalizacao();
        this.totalLotes = fazenda.getLotes().size();
    }
}
