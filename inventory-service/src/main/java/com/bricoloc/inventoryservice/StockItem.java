package com.bricoloc.inventoryservice;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockItem {

	@Id
	@GeneratedValue
	private Long id;

	// Référence technique de l'outil (ex: PERCEUSE-BOSCH)
	@Column(unique = true)
	private String toolRef;

	// Quantité disponible en temps réel
	private int quantity;
}
