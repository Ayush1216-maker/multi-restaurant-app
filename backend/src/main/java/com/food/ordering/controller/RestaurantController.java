package com.food.ordering.controller;

import com.food.ordering.dto.RestaurantDTO;
import com.food.ordering.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<RestaurantDTO> getRestaurantByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(restaurantService.getRestaurantByOwner(ownerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESTAURANT')")
    public ResponseEntity<RestaurantDTO> createRestaurant(@RequestBody RestaurantDTO dto) {
        return ResponseEntity.ok(restaurantService.createRestaurant(dto));
    }
}
