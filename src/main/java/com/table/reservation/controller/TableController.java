package com.table.reservation.controller;

import com.table.reservation.entity.Table;
import com.table.reservation.service.TableService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public List<Table> getAllTables() {
        return tableService.getAllTables();
    }

    @GetMapping("/{id}")
    public Table getTable(@PathVariable Long id) {
        return tableService.getTable(id);
    }

    @PostMapping
    public Table addTable(@RequestBody Table table) {
        return tableService.addTable(table);
    }

    @PutMapping("/{id}/seat")
    public Table seatTable(@PathVariable Long id) {
        return tableService.updateStatus(id, "SEATED");
    }

    @PutMapping("/{id}/free")
    public Table freeTable(@PathVariable Long id) {
        return tableService.updateStatus(id, "FREE");
    }
}