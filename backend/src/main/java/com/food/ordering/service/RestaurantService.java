package com.food.ordering.service;

import com.food.ordering.dto.RestaurantDTO;
import com.food.ordering.model.Restaurant;
import com.food.ordering.model.User;
import com.food.ordering.repository.RestaurantRepository;
import com.food.ordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    public RestaurantDTO createRestaurant(RestaurantDTO dto) {
        User owner = userRepository.findById(dto.getOwnerId()).orElseThrow();
        Restaurant restaurant = new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setOwner(owner);
        return mapToDTO(restaurantRepository.save(restaurant));
    }

    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public RestaurantDTO getRestaurantByOwner(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId)
                .map(this::mapToDTO)
                .orElse(null);
    }

    private RestaurantDTO mapToDTO(Restaurant restaurant) {
        return RestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .ownerId(restaurant.getOwner().getId())
                .build();
    }
}
