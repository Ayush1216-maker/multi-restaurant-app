package com.food.ordering.service;

import com.food.ordering.dto.FoodDTO;
import com.food.ordering.model.Category;
import com.food.ordering.model.Food;
import com.food.ordering.model.Restaurant;
import com.food.ordering.repository.CategoryRepository;
import com.food.ordering.repository.FoodRepository;
import com.food.ordering.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public FoodDTO createFood(FoodDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId()).orElseThrow();

        Food food = new Food();
        food.setName(dto.getName());
        food.setPrice(dto.getPrice());
        food.setCategory(category);
        food.setRestaurant(restaurant);

        return mapToDTO(foodRepository.save(food));
    }

    public FoodDTO updateFood(Long id, FoodDTO dto) {
        Food food = foodRepository.findById(id).orElseThrow();
        food.setName(dto.getName());
        food.setPrice(dto.getPrice());

        if (dto.getCategoryId() != null) {
            food.setCategory(categoryRepository.findById(dto.getCategoryId()).orElseThrow());
        }
        
        return mapToDTO(foodRepository.save(food));
    }

    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
    
    public List<FoodDTO> getAllFoods() {
        return foodRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<FoodDTO> getFoodsByRestaurant(Long restaurantId) {
        return foodRepository.findByRestaurantId(restaurantId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<FoodDTO> getFoodsByCategory(Long categoryId) {
        return foodRepository.findByCategoryId(categoryId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<FoodDTO> searchFoodByName(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private FoodDTO mapToDTO(Food food) {
        return FoodDTO.builder()
                .id(food.getId())
                .name(food.getName())
                .price(food.getPrice())
                .categoryId(food.getCategory().getId())
                .categoryName(food.getCategory().getName())
                .restaurantId(food.getRestaurant().getId())
                .restaurantName(food.getRestaurant().getName())
                .build();
    }
}
