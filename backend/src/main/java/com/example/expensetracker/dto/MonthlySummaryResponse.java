package com.example.expensetracker.dto;

import java.math.BigDecimal;

public class MonthlySummaryResponse {

    private int year;
    private int month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;

    public MonthlySummaryResponse() {
    }

    public MonthlySummaryResponse(int year, int month, BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal balance) {
        this.year = year;
        this.month = month;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
