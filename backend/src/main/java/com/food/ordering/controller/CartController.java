package com.food.ordering.controller;

import com.food.ordering.dto.CartItemDTO;
import com.food.ordering.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCartItemsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartItemsByUser(userId));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<CartItemDTO> addItemToCart(@RequestBody CartItemDTO dto) {
        return ResponseEntity.ok(cartService.addItemToCart(dto));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/{id}")
    public ResponseEntity<CartItemDTO> updateCartItemQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(id, quantity));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long id) {
        cartService.removeCartItem(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/clear/user/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
}
