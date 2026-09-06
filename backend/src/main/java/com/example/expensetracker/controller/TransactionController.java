package com.example.expensetracker.controller;

import com.example.expensetracker.dto.CategorySummaryResponse;
import com.example.expensetracker.dto.MonthlySummaryResponse;
import com.example.expensetracker.dto.SummaryResponse;
import com.example.expensetracker.dto.TransactionRequest;
import com.example.expensetracker.dto.TransactionResponse;
import com.example.expensetracker.model.TransactionType;
import com.example.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable String id) {
        TransactionResponse transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse created = transactionService.createTransaction(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable String id,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse updated = transactionService.updateTransaction(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTransaction(@PathVariable String id) {
        transactionService.deleteTransaction(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Transaction deleted successfully with id: " + id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TransactionResponse>> searchTransactions(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String title) {
        String searchTerm = (query != null && !query.trim().isEmpty()) ? query : title;
        List<TransactionResponse> results = transactionService.searchTransactions(searchTerm);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TransactionResponse>> filterTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        List<TransactionResponse> results = transactionService.filterTransactions(type, category, fromDate, toDate);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> getSummary() {
        SummaryResponse summary = transactionService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/summary/categories")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary() {
        List<CategorySummaryResponse> categorySummary = transactionService.getCategorySummary();
        return ResponseEntity.ok(categorySummary);
    }

    @GetMapping("/summary/monthly")
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month) {
        MonthlySummaryResponse monthlySummary = transactionService.getMonthlySummary(year, month);
        return ResponseEntity.ok(monthlySummary);
    }
}
