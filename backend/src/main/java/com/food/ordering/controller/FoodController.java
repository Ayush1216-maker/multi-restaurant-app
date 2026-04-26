package com.food.ordering.controller;

import com.food.ordering.dto.FoodDTO;
import com.food.ordering.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    public ResponseEntity<List<FoodDTO>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<FoodDTO>> getFoodsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(foodService.getFoodsByRestaurant(restaurantId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FoodDTO>> getFoodsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(foodService.getFoodsByCategory(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodDTO>> searchFoods(@RequestParam String name) {
        return ResponseEntity.ok(foodService.searchFoodByName(name));
    }

    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<FoodDTO> createFood(@RequestBody FoodDTO dto) {
        return ResponseEntity.ok(foodService.createFood(dto));
    }

    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<FoodDTO> updateFood(@PathVariable Long id, @RequestBody FoodDTO dto) {
        return ResponseEntity.ok(foodService.updateFood(id, dto));
    }

    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok().build();
    }
}
