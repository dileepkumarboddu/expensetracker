package com.example.expensetracker.service;

import com.example.expensetracker.dto.CategorySummaryResponse;
import com.example.expensetracker.dto.MonthlySummaryResponse;
import com.example.expensetracker.dto.SummaryResponse;
import com.example.expensetracker.dto.TransactionRequest;
import com.example.expensetracker.dto.TransactionResponse;
import com.example.expensetracker.model.TransactionType;

import java.time.LocalDate;
import java.util.List;

public interface TransactionService {

    TransactionResponse createTransaction(TransactionRequest request);

    List<TransactionResponse> getAllTransactions();

    TransactionResponse getTransactionById(String id);

    TransactionResponse updateTransaction(String id, TransactionRequest request);

    void deleteTransaction(String id);

    List<TransactionResponse> searchTransactions(String query);

    List<TransactionResponse> filterTransactions(TransactionType type, String category, LocalDate fromDate, LocalDate toDate);

    SummaryResponse getSummary();

    List<CategorySummaryResponse> getCategorySummary();

    MonthlySummaryResponse getMonthlySummary(int year, int month);
}
