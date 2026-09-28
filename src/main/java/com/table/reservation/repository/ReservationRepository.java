package com.table.reservation.repository;

import com.table.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    boolean existsByTableIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long tableId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime
    );
}