package com.table.reservation.controller;

import com.table.reservation.entity.Bill;
import com.table.reservation.service.BillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping("/{orderId}")
    public Bill createBill(@PathVariable Long orderId) {
        return billService.createBill(orderId);
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public Bill getBill(@PathVariable Long id) {
        return billService.getBill(id);
    }
}