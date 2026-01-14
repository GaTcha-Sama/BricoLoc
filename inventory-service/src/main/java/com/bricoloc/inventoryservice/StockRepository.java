package com.bricoloc.inventoryservice;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StockRepository extends JpaRepository<StockItem, Long> {
    // Spring Data génère automatiquement la requête SQL derrière cette méthode
    Optional<StockItem> findByToolRef(String toolRef);
}
