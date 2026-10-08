package com.agrotech.cadastros.service;

import com.agrotech.cadastros.dto.*;
import com.agrotech.cadastros.entity.Usuario;
import com.agrotech.cadastros.repository.UsuarioRepository;
import com.agrotech.cadastros.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Registra um novo usuário.
     * Lança 409 se o e-mail já estiver em uso.
     */
    public UsuarioResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senhaHash(passwordEncoder.encode(request.getSenha()))
                .build();

        usuario = usuarioRepository.save(usuario);
        return new UsuarioResponse(usuario);
    }

    /**
     * Autentica o usuário e retorna um token JWT.
     * Lança 401 genérico para não revelar se o e-mail existe.
     */
    public TokenResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenhaHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        String token = jwtTokenProvider.gerarToken(usuario.getEmail());
        return TokenResponse.of(token, jwtTokenProvider.getExpiraEm(token));
    }

    /**
     * Retorna os dados do usuário autenticado pelo e-mail extraído do token.
     * Usado pelo endpoint GET /auth/me.
     */
    public UsuarioResponse buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return new UsuarioResponse(usuario);
    }
}
