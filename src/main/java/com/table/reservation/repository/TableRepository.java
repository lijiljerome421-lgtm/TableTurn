package com.table.reservation.repository;

import com.table.reservation.entity.Table;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<Table, Long> {
}