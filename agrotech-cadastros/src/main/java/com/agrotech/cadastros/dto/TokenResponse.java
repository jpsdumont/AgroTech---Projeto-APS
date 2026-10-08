package com.agrotech.cadastros.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TokenResponse {

    private String token;
    private String tipo;
    private LocalDateTime expiraEm;

    public static TokenResponse of(String token, LocalDateTime expiraEm) {
        return new TokenResponse(token, "Bearer", expiraEm);
    }
}
