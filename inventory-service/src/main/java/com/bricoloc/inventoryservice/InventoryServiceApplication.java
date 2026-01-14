package com.bricoloc.inventoryservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(StockRepository repository) {
        return args -> {
            // On initialise le stock pour la démo
            repository.save(new StockItem(null, "PERCEUSE-PRO", 5));
            repository.save(new StockItem(null, "PONCEUSE-B300", 2));
            System.out.println("--- DONNÉES DE DÉMO CHARGÉES ---");
        };
    }
}
