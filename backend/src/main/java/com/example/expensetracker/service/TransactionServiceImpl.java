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
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public TransactionResponse createTransaction(TransactionRequest request) {
        LocalDateTime now = LocalDateTime.now();
        Transaction transaction = new Transaction();
        transaction.setTitle(request.getTitle());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setDescription(request.getDescription());
        transaction.setCreatedAt(now);
        transaction.setUpdatedAt(now);

        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return transactions.stream()
                .sorted(Comparator.comparing(Transaction::getTransactionDate).reversed()
                        .thenComparing(Transaction::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionResponse getTransactionById(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return mapToResponse(transaction);
    }

    @Override
    public TransactionResponse updateTransaction(String id, TransactionRequest request) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        existing.setTitle(request.getTitle());
        existing.setAmount(request.getAmount());
        existing.setType(request.getType());
        existing.setCategory(request.getCategory());
        existing.setTransactionDate(request.getTransactionDate());
        existing.setDescription(request.getDescription());
        existing.setUpdatedAt(LocalDateTime.now());

        Transaction updated = transactionRepository.save(existing);
        return mapToResponse(updated);
    }

    @Override
    public void deleteTransaction(String id) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        transactionRepository.deleteById(existing.getId());
    }

    @Override
    public List<TransactionResponse> searchTransactions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllTransactions();
        }
        String searchTerm = query.trim();
        List<Transaction> transactions = transactionRepository
                .findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        searchTerm, searchTerm, searchTerm
                );
        return transactions.stream()
                .sorted(Comparator.comparing(Transaction::getTransactionDate).reversed())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> filterTransactions(TransactionType type, String category, LocalDate fromDate, LocalDate toDate) {
        List<Transaction> transactions = transactionRepository.findAll();

        return transactions.stream()
                .filter(t -> type == null || t.getType() == type)
                .filter(t -> category == null || category.trim().isEmpty() || t.getCategory().equalsIgnoreCase(category.trim()))
                .filter(t -> fromDate == null || !t.getTransactionDate().isBefore(fromDate))
                .filter(t -> toDate == null || !t.getTransactionDate().isAfter(toDate))
                .sorted(Comparator.comparing(Transaction::getTransactionDate).reversed())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SummaryResponse getSummary() {
        List<Transaction> transactions = transactionRepository.findAll();

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Transaction t : transactions) {
            if (t.getAmount() != null) {
                if (t.getType() == TransactionType.INCOME) {
                    totalIncome = totalIncome.add(t.getAmount());
                } else if (t.getType() == TransactionType.EXPENSE) {
                    totalExpense = totalExpense.add(t.getAmount());
                }
            }
        }

        BigDecimal balance = totalIncome.subtract(totalExpense);
        return new SummaryResponse(totalIncome, totalExpense, balance, transactions.size());
    }

    @Override
    public List<CategorySummaryResponse> getCategorySummary() {
        List<Transaction> transactions = transactionRepository.findAll();

        Map<String, BigDecimal> categoryTotals = new HashMap<>();

        for (Transaction t : transactions) {
            if (t.getType() == TransactionType.EXPENSE && t.getAmount() != null && t.getCategory() != null) {
                String cat = t.getCategory().trim();
                BigDecimal current = categoryTotals.getOrDefault(cat, BigDecimal.ZERO);
                categoryTotals.put(cat, current.add(t.getAmount()));
            }
        }

        List<CategorySummaryResponse> list = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categoryTotals.entrySet()) {
            list.add(new CategorySummaryResponse(entry.getKey(), entry.getValue()));
        }

        list.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        return list;
    }

    @Override
    public MonthlySummaryResponse getMonthlySummary(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startOfMonth = yearMonth.atDay(1);
        LocalDate endOfMonth = yearMonth.atEndOfMonth();

        List<Transaction> transactions = transactionRepository.findByTransactionDateBetween(startOfMonth, endOfMonth);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Transaction t : transactions) {
            if (t.getAmount() != null) {
                if (t.getType() == TransactionType.INCOME) {
                    totalIncome = totalIncome.add(t.getAmount());
                } else if (t.getType() == TransactionType.EXPENSE) {
                    totalExpense = totalExpense.add(t.getAmount());
                }
            }
        }

        BigDecimal balance = totalIncome.subtract(totalExpense);
        return new MonthlySummaryResponse(year, month, totalIncome, totalExpense, balance);
    }

    private TransactionResponse mapToResponse(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getTitle(),
                t.getAmount(),
                t.getType(),
                t.getCategory(),
                t.getTransactionDate(),
                t.getDescription(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}
