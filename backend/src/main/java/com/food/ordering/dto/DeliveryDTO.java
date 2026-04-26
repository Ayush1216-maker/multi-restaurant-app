package com.food.ordering.dto;

import com.food.ordering.model.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDTO {
    private Long id;
    private Long orderId;
    private Long deliveryPersonId;
    private String deliveryPersonName;
    private DeliveryStatus status;
}
