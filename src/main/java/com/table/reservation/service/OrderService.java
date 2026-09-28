package com.table.reservation.service;

import com.table.reservation.entity.*;
import com.table.reservation.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    public OrderService(OrderRepository orderRepository,
                        TableRepository tableRepository) {
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
    }

    public Order addOrder(Order order) {

        Long tableId = order.getTable().getId();

        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        if (!"SEATED".equals(table.getStatus())) {
            throw new RuntimeException("Table must be SEATED before placing an order");
        }

        order.setStatus("OPEN");

        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
        }

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}