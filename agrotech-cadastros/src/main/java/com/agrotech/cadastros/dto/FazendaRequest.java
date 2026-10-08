package com.agrotech.cadastros.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FazendaRequest {

    @NotBlank(message = "Nome da fazenda é obrigatório")
    private String nome;

    private String localizacao;
}
