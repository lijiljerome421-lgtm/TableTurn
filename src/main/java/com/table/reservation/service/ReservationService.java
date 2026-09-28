package com.table.reservation.service;

import com.table.reservation.entity.Reservation;
import com.table.reservation.entity.Table;
import com.table.reservation.repository.ReservationRepository;
import com.table.reservation.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TableRepository tableRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            TableRepository tableRepository) {

        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservation(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Reservation not found"));
    }

    public Reservation addReservation(Reservation reservation) {

        if (reservation.getTable() == null ||
                reservation.getTable().getId() == null) {

            throw new RuntimeException("Please select a table");
        }


        Long tableId =
                reservation.getTable().getId();


        Table table =
                tableRepository.findById(tableId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Table not found"
                                ));


        if (reservation.getDate() == null ||
                reservation.getStartTime() == null ||
                reservation.getEndTime() == null) {

            throw new RuntimeException(
                    "Date and time are required"
            );
        }


        if (!reservation.getStartTime()
                .isBefore(reservation.getEndTime())) {

            throw new RuntimeException(
                    "End time must be after start time"
            );
        }


        if (reservation.getPartySize() <= 0) {

            throw new RuntimeException(
                    "Party size must be greater than zero"
            );
        }


        if (reservation.getPartySize() >
                table.getCapacity()) {

            throw new RuntimeException(
                    "Table capacity is only "
                            + table.getCapacity()
                            + " guests"
            );
        }


        boolean exists =
                reservationRepository
                        .existsByTableIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                tableId,
                                reservation.getDate(),
                                reservation.getEndTime(),
                                reservation.getStartTime()
                        );


        if (exists) {

            throw new RuntimeException(
                    "Table is already reserved for this time"
            );
        }


        /*
         * Store the complete table entity.
         */

        reservation.setTable(table);


        return reservationRepository.save(reservation);
    }


    public void deleteReservation(Long id) {

        if (!reservationRepository.existsById(id)) {

            throw new RuntimeException(
                    "Reservation not found"
            );
        }

        reservationRepository.deleteById(id);
    }
}