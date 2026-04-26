package com.food.ordering.service;

import com.food.ordering.dto.DeliveryDTO;
import com.food.ordering.model.*;
import com.food.ordering.repository.DeliveryRepository;
import com.food.ordering.repository.OrderRepository;
import com.food.ordering.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public DeliveryDTO assignDelivery(Long orderId, Long deliveryPersonId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        User person = userRepository.findById(deliveryPersonId).orElseThrow();

        if (person.getRole() != Role.DELIVERY) {
            throw new RuntimeException("User is not a delivery person");
        }

        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDeliveryPerson(person);
        delivery.setStatus(DeliveryStatus.PENDING);

        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        orderRepository.save(order);

        return mapToDTO(deliveryRepository.save(delivery));
    }

    @Transactional
    public DeliveryDTO updateDeliveryStatus(Long deliveryId, DeliveryStatus status) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow();
        delivery.setStatus(status);

        if (status == DeliveryStatus.DELIVERED) {
            Order order = delivery.getOrder();
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);
        }

        return mapToDTO(deliveryRepository.save(delivery));
    }

    public List<DeliveryDTO> getDeliveriesByPerson(Long personId) {
        return deliveryRepository.findByDeliveryPersonId(personId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private DeliveryDTO mapToDTO(Delivery delivery) {
        return DeliveryDTO.builder()
                .id(delivery.getId())
                .orderId(delivery.getOrder().getId())
                .deliveryPersonId(delivery.getDeliveryPerson().getId())
                .deliveryPersonName(delivery.getDeliveryPerson().getName())
                .status(delivery.getStatus())
                .build();
    }
}
