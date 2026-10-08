package com.agrotech.cadastros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoteRequest {

    @NotNull(message = "ID da fazenda é obrigatório")
    private Long fazendaId;

    @NotBlank(message = "Nome do lote é obrigatório")
    private String nome;

    @PositiveOrZero(message = "Quantidade deve ser zero ou positiva")
    private Integer quantidade;

    private String tipo;

    private String pasto;
}
