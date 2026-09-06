package com.example.expensetracker.controller;

import com.example.expensetracker.dto.SummaryResponse;
import com.example.expensetracker.dto.TransactionRequest;
import com.example.expensetracker.dto.TransactionResponse;
import com.example.expensetracker.model.TransactionType;
import com.example.expensetracker.service.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionController.class)
public class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TransactionService transactionService;

    @Test
    void testGetAllTransactions() throws Exception {
        TransactionResponse response = new TransactionResponse(
                "test-id",
                "Salary",
                new BigDecimal("50000"),
                TransactionType.INCOME,
                "Salary",
                LocalDate.of(2026, 9, 1),
                "Monthly salary",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(transactionService.getAllTransactions()).thenReturn(Collections.singletonList(response));

        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("test-id"))
                .andExpect(jsonPath("$[0].title").value("Salary"))
                .andExpect(jsonPath("$[0].amount").value(50000));
    }

    @Test
    void testCreateTransaction() throws Exception {
        TransactionRequest request = new TransactionRequest(
                "Lunch",
                new BigDecimal("250"),
                TransactionType.EXPENSE,
                "Food",
                LocalDate.of(2026, 9, 5),
                "Team lunch"
        );

        TransactionResponse response = new TransactionResponse(
                "new-123",
                "Lunch",
                new BigDecimal("250"),
                TransactionType.EXPENSE,
                "Food",
                LocalDate.of(2026, 9, 5),
                "Team lunch",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(transactionService.createTransaction(any(TransactionRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("new-123"))
                .andExpect(jsonPath("$.title").value("Lunch"));
    }

    @Test
    void testGetSummary() throws Exception {
        SummaryResponse summary = new SummaryResponse(
                new BigDecimal("50000"),
                new BigDecimal("20000"),
                new BigDecimal("30000"),
                5
        );

        when(transactionService.getSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/transactions/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncome").value(50000))
                .andExpect(jsonPath("$.totalExpense").value(20000))
                .andExpect(jsonPath("$.balance").value(30000))
                .andExpect(jsonPath("$.transactionCount").value(5));
    }
}
