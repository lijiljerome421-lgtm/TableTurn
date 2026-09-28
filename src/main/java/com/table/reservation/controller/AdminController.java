package com.table.reservation.controller;

import com.table.reservation.entity.Table;
import com.table.reservation.service.TableService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final TableService tableService;

    public AdminController(TableService tableService) {
        this.tableService = tableService;
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session) {

        if ("admin".equals(username)
                && "admin123".equals(password)) {

            session.setAttribute("ADMIN", true);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Login successful"
                    )
            );
        }

        return ResponseEntity
                .status(401)
                .body(
                        Map.of(
                                "message",
                                "Invalid username or password"
                        )
                );
    }


    // ================= CHECK LOGIN =================

    @GetMapping("/check")
    public ResponseEntity<?> checkLogin(
            HttpSession session) {

        boolean loggedIn =
                Boolean.TRUE.equals(
                        session.getAttribute("ADMIN")
                );

        if (loggedIn) {

            return ResponseEntity.ok(
                    Map.of(
                            "loggedIn",
                            true
                    )
            );
        }

        return ResponseEntity
                .status(401)
                .body(
                        Map.of(
                                "loggedIn",
                                false
                        )
                );
    }


    // ================= LOGOUT =================

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Logged out successfully"
                )
        );
    }


    // ================= TABLES =================

    @GetMapping("/tables")
    public List<Table> getTables(
            HttpSession session) {

        requireAdmin(session);

        return tableService.getAllTables();
    }


    @PostMapping("/tables")
    public Table addTable(
            @RequestBody Table table,
            HttpSession session) {

        requireAdmin(session);

        return tableService.addTable(table);
    }


    @PutMapping("/tables/{id}/seat")
    public Table seatTable(
            @PathVariable Long id,
            HttpSession session) {

        requireAdmin(session);

        return tableService.updateStatus(
                id,
                "SEATED"
        );
    }


    @PutMapping("/tables/{id}/free")
    public Table freeTable(
            @PathVariable Long id,
            HttpSession session) {

        requireAdmin(session);

        return tableService.updateStatus(
                id,
                "FREE"
        );
    }


    @DeleteMapping("/tables/{id}")
    public String deleteTable(
            @PathVariable Long id,
            HttpSession session) {

        requireAdmin(session);

        tableService.deleteTable(id);

        return "Table deleted successfully";
    }


    // ================= SECURITY =================

    private void requireAdmin(
            HttpSession session) {

        boolean loggedIn =
                session != null
                &&
                Boolean.TRUE.equals(
                        session.getAttribute("ADMIN")
                );

        if (!loggedIn) {

            throw new RuntimeException(
                    "Admin login required"
            );
        }
    }
}