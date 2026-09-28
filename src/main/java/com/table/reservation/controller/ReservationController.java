package com.table.reservation.controller;

import com.table.reservation.entity.Reservation;
import com.table.reservation.service.ReservationService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public Reservation getReservation(@PathVariable Long id) {
        return reservationService.getReservation(id);
    }

    @PostMapping
    public Reservation addReservation(@Valid @RequestBody Reservation reservation)     
    {  
         return reservationService.addReservation(reservation);
    }

    @DeleteMapping("/{id}")
    public String deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return "Reservation deleted successfully";
    }
}