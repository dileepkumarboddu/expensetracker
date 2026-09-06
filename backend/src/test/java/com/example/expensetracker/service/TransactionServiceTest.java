package com.example.expensetracker.service;

import com.example.expensetracker.dto.CategorySummaryResponse;
import com.example.expensetracker.dto.MonthlySummaryResponse;
import com.example.expensetracker.dto.SummaryResponse;
import com.example.expensetracker.dto.TransactionRequest;
import com.example.expensetracker.dto.TransactionResponse;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.model.Transaction;
import com.example.expensetracker.model.TransactionType;
import com.example.expensetracker.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private Transaction sampleIncome;
    private Transaction sampleExpense;

    @BeforeEach
    void setUp() {
        sampleIncome = new Transaction(
                "id-1",
                "Monthly Salary",
                new BigDecimal("50000"),
                TransactionType.INCOME,
                "Salary",
                LocalDate.of(2026, 9, 1),
                "Monthly salary credit",
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        sampleExpense = new Transaction(
                "id-2",
                "Grocery Shopping",
                new BigDecimal("2000"),
                TransactionType.EXPENSE,
                "Groceries",
                LocalDate.of(2026, 9, 2),
                "Weekly groceries",
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    void testCreateTransaction() {
        TransactionRequest request = new TransactionRequest(
                "Freelance Gig",
                new BigDecimal("15000"),
                TransactionType.INCOME,
                "Freelancing",
                LocalDate.of(2026, 9, 3),
                "Web dev project"
        );

        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction t = invocation.getArgument(0);
            t.setId("new-id-123");
            return t;
        });

        TransactionResponse response = transactionService.createTransaction(request);

        assertNotNull(response);
        assertEquals("Freelance Gig", response.getTitle());
        assertEquals(new BigDecimal("15000"), response.getAmount());
        assertEquals(TransactionType.INCOME, response.getType());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    void testGetTransactionById_Success() {
        when(transactionRepository.findById("id-1")).thenReturn(Optional.of(sampleIncome));

        TransactionResponse response = transactionService.getTransactionById("id-1");

        assertNotNull(response);
        assertEquals("Monthly Salary", response.getTitle());
        assertEquals("id-1", response.getId());
    }

    @Test
    void testGetTransactionById_NotFound() {
        when(transactionRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            transactionService.getTransactionById("non-existent");
        });
    }

    @Test
    void testGetSummary() {
        when(transactionRepository.findAll()).thenReturn(Arrays.asList(sampleIncome, sampleExpense));

        SummaryResponse summary = transactionService.getSummary();

        assertNotNull(summary);
        assertEquals(new BigDecimal("50000"), summary.getTotalIncome());
        assertEquals(new BigDecimal("2000"), summary.getTotalExpense());
        assertEquals(new BigDecimal("48000"), summary.getBalance());
        assertEquals(2, summary.getTransactionCount());
    }

    @Test
    void testGetCategorySummary() {
        when(transactionRepository.findAll()).thenReturn(Arrays.asList(sampleIncome, sampleExpense));

        List<CategorySummaryResponse> categorySummaries = transactionService.getCategorySummary();

        assertNotNull(categorySummaries);
        assertEquals(1, categorySummaries.size());
        assertEquals("Groceries", categorySummaries.get(0).getCategory());
        assertEquals(new BigDecimal("2000"), categorySummaries.get(0).getAmount());
    }

    @Test
    void testGetMonthlySummary() {
        LocalDate start = LocalDate.of(2026, 9, 1);
        LocalDate end = LocalDate.of(2026, 9, 30);
        when(transactionRepository.findByTransactionDateBetween(start, end))
                .thenReturn(Arrays.asList(sampleIncome, sampleExpense));

        MonthlySummaryResponse monthly = transactionService.getMonthlySummary(2026, 9);

        assertNotNull(monthly);
        assertEquals(2026, monthly.getYear());
        assertEquals(9, monthly.getMonth());
        assertEquals(new BigDecimal("50000"), monthly.getTotalIncome());
        assertEquals(new BigDecimal("2000"), monthly.getTotalExpense());
        assertEquals(new BigDecimal("48000"), monthly.getBalance());
    }

    @Test
    void testDeleteTransaction_Success() {
        when(transactionRepository.findById("id-1")).thenReturn(Optional.of(sampleIncome));
        doNothing().when(transactionRepository).deleteById("id-1");

        transactionService.deleteTransaction("id-1");

        verify(transactionRepository, times(1)).deleteById("id-1");
    }
}
