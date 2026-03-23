package com.bricoloc.inventoryservice;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Optional;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockRepository repository;

    public StockController(StockRepository repository) {
        this.repository = repository;
    }

    // 1. Consultation du stock (Lecture temps réel)
    @GetMapping("/{ref}")
    public ResponseEntity<StockItem> getStock(@PathVariable String ref) {
        return repository.findByToolRef(ref)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. Réservation d'un outil (Écriture temps réel)
    // C'est ça qui remplace le CSV du soir : la décrémentation est immédiate.
    @PostMapping("/{ref}/reserve")
    public ResponseEntity<String> reserveTool(@PathVariable String ref) {
        Optional<StockItem> stockOpt = repository.findByToolRef(ref);

        if (stockOpt.isPresent()) {
            StockItem item = stockOpt.get();
            if (item.getQuantity() > 0) {
                item.setQuantity(item.getQuantity() - 1);
                repository.save(item); // Commit immédiat en base
                return ResponseEntity.ok("Succès : Outil réservé. Stock restant : " + item.getQuantity());
            } else {
                return ResponseEntity.status(409).body("Erreur : Rupture de stock !");
            }
        }
        return ResponseEntity.notFound().build();
    }
}   
