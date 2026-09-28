package com.table.reservation.service;

import com.table.reservation.entity.Bill;
import com.table.reservation.entity.Order;
import com.table.reservation.entity.OrderItem;
import com.table.reservation.entity.Table;
import com.table.reservation.repository.BillRepository;
import com.table.reservation.repository.OrderRepository;
import com.table.reservation.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    public BillService(BillRepository billRepository,
                       OrderRepository orderRepository,
                       TableRepository tableRepository) {
        this.billRepository = billRepository;
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
    }

    public Bill createBill(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        double total = 0;

        for (OrderItem item : order.getItems()) {
            total += item.getQuantity() * item.getPrice();
        }

        Bill bill = new Bill();
        bill.setOrder(order);
        bill.setTotalAmount(total);
        bill.setPaymentStatus("PENDING");
        bill.setCreatedAt(LocalDateTime.now());

        order.setStatus("COMPLETED");
        orderRepository.save(order);

        Table table = order.getTable();
        table.setStatus("FREE");
        tableRepository.save(table);

        return billRepository.save(bill);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBill(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
    }
}