package com.agrotech.cadastros.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lote")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fazenda_id", nullable = false)
    private Fazenda fazenda;

    @Column(nullable = false)
    private String nome;

    private Integer quantidade;

    private String tipo;

    private String pasto;
}
