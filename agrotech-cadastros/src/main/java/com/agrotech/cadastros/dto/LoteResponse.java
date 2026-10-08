package com.agrotech.cadastros.dto;

import com.agrotech.cadastros.entity.Lote;
import lombok.Getter;

@Getter
public class LoteResponse {

    private final Long id;
    private final String nome;
    private final Integer quantidade;
    private final String tipo;
    private final String pasto;
    private final Long fazendaId;

    public LoteResponse(Lote lote) {
        this.id = lote.getId();
        this.nome = lote.getNome();
        this.quantidade = lote.getQuantidade();
        this.tipo = lote.getTipo();
        this.pasto = lote.getPasto();
        this.fazendaId = lote.getFazenda().getId();
    }
}
