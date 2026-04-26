package com.food.ordering.controller;

import com.food.ordering.dto.OrderDTO;
import com.food.ordering.model.OrderStatus;
import com.food.ordering.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN')")
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.getOrdersByRestaurant(restaurantId));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/place/{userId}/{restaurantId}")
    public ResponseEntity<OrderDTO> placeOrder(@PathVariable Long userId, @PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.placeOrder(userId, restaurantId));
    }

    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN') or hasRole('DELIVERY')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
