package com.food.ordering.service;

import com.food.ordering.dto.OrderDTO;
import com.food.ordering.dto.OrderItemDTO;
import com.food.ordering.model.*;
import com.food.ordering.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Transactional
    public OrderDTO placeOrder(Long userId, Long restaurantId) {
        User user = userRepository.findById(userId).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow();

        // Get cart items for logic checking, only checking for this restaurant's items
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId).stream()
                .filter(item -> item.getFood().getRestaurant().getId().equals(restaurantId))
                .collect(Collectors.toList());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty for this restaurant");
        }

        Double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getFood().getPrice() * item.getQuantity())
                .sum();

        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PLACED);

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFood(cartItem.getFood());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getFood().getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Remove ordered items from cart
        cartItemRepository.deleteAll(cartItems);

        return mapToDTO(savedOrder);
    }

    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(status);
        return mapToDTO(orderRepository.save(order));
    }

    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByRestaurant(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private OrderDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream().map(item ->
                OrderItemDTO.builder()
                        .id(item.getId())
                        .foodId(item.getFood().getId())
                        .foodName(item.getFood().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build()
        ).collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userName(order.getUser().getName())
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .items(itemDTOs)
                .build();
    }
}
