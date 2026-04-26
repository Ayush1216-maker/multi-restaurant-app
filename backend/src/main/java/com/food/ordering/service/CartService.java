package com.food.ordering.service;

import com.food.ordering.dto.CartItemDTO;
import com.food.ordering.model.CartItem;
import com.food.ordering.model.Food;
import com.food.ordering.model.User;
import com.food.ordering.repository.CartItemRepository;
import com.food.ordering.repository.FoodRepository;
import com.food.ordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private UserRepository userRepository;

    public CartItemDTO addItemToCart(CartItemDTO dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow();
        Food food = foodRepository.findById(dto.getFoodId()).orElseThrow();

        // Check if item already exists in cart for the user
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        for (CartItem item : cartItems) {
            if (item.getFood().getId().equals(food.getId())) {
                item.setQuantity(item.getQuantity() + dto.getQuantity());
                return mapToDTO(cartItemRepository.save(item));
            }
        }

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setFood(food);
        cartItem.setQuantity(dto.getQuantity());

        return mapToDTO(cartItemRepository.save(cartItem));
    }

    public CartItemDTO updateCartItemQuantity(Long id, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(id).orElseThrow();
        cartItem.setQuantity(quantity);
        return mapToDTO(cartItemRepository.save(cartItem));
    }

    public void removeCartItem(Long id) {
        cartItemRepository.deleteById(id);
    }

    public List<CartItemDTO> getCartItemsByUser(Long userId) {
        return cartItemRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartItemDTO mapToDTO(CartItem item) {
        Double totalPrice = item.getFood().getPrice() * item.getQuantity();
        return CartItemDTO.builder()
                .id(item.getId())
                .userId(item.getUser().getId())
                .foodId(item.getFood().getId())
                .foodName(item.getFood().getName())
                .foodPrice(item.getFood().getPrice())
                .quantity(item.getQuantity())
                .totalPrice(totalPrice)
                .build();
    }
}
