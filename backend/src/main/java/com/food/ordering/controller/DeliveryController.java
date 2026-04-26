package com.food.ordering.controller;

import com.food.ordering.dto.DeliveryDTO;
import com.food.ordering.model.DeliveryStatus;
import com.food.ordering.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN')")
    @PostMapping("/assign")
    public ResponseEntity<DeliveryDTO> assignDelivery(@RequestParam Long orderId, @RequestParam Long deliveryPersonId) {
        return ResponseEntity.ok(deliveryService.assignDelivery(orderId, deliveryPersonId));
    }

    @PreAuthorize("hasRole('DELIVERY') or hasRole('ADMIN')")
    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<DeliveryDTO> updateDeliveryStatus(@PathVariable Long deliveryId, @RequestParam DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(deliveryId, status));
    }

    @PreAuthorize("hasRole('DELIVERY')")
    @GetMapping("/person/{personId}")
    public ResponseEntity<List<DeliveryDTO>> getDeliveriesByPerson(@PathVariable Long personId) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByPerson(personId));
    }
}
