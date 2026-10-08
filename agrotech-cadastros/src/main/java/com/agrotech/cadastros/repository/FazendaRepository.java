package com.agrotech.cadastros.repository;

import com.agrotech.cadastros.entity.Fazenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FazendaRepository extends JpaRepository<Fazenda, Long> {

    List<Fazenda> findByDonoId(Long donoId);

    Optional<Fazenda> findByIdAndDonoId(Long id, Long donoId);
}
