package com.table.reservation.service;

import com.table.reservation.entity.Table;
import com.table.reservation.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService {

    private final TableRepository tableRepository;

    public TableService(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    public List<Table> getAllTables() {
        return tableRepository.findAll();
    }

    public Table getTable(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found"));
    }

    public Table addTable(Table table) {
        if (table.getStatus() == null || table.getStatus().isBlank()) {
            table.setStatus("FREE");
        }

        return tableRepository.save(table);
    }

    public Table updateStatus(Long id, String status) {
        Table table = getTable(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }

    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new RuntimeException("Table not found");
        }

        tableRepository.deleteById(id);
    }
}