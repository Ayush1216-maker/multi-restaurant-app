package com.food.ordering.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long userId;
    private Long foodId;
    private String foodName;
    private Double foodPrice;
    private Integer quantity;
    private Double totalPrice;
}
