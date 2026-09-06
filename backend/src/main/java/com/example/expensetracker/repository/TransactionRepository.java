package com.example.expensetracker.repository;

import com.example.expensetracker.model.Transaction;
import com.example.expensetracker.model.TransactionType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    List<Transaction> findByTitleContainingIgnoreCase(String title);

    List<Transaction> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title, String category, String description
    );

    List<Transaction> findByType(TransactionType type);

    List<Transaction> findByCategoryIgnoreCase(String category);

    List<Transaction> findByTransactionDateBetween(LocalDate fromDate, LocalDate toDate);

    List<Transaction> findByTypeAndTransactionDateBetween(TransactionType type, LocalDate fromDate, LocalDate toDate);
}
