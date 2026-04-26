package com.food.ordering.dto;

import com.food.ordering.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long restaurantId;
    private String restaurantName;
    private Double totalAmount;
    private OrderStatus status;
    private List<OrderItemDTO> items;
}
