import React, { useState, useEffect } from 'react';
import Navbar from '../../feature/navbar';
import EditBudgetModal from "../../feature/bt-uploader/edit-budget";
import AddTransactionModal from "../../feature/bt-uploader/add-transaction";
import ExpenseChart from "../../feature/graphs/expense-chart";
import MonthlyReportModal from "../../feature/bt-uploader/monthly-report";
import AreaChart from '../../feature/graphs/AreaChart';
import useInactivityTimeout from '@/hooks/useInactivityTimeout';

export default function BudgetTracker() {
  useInactivityTimeout();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAddTransaction, setIsAddTransaction] = useState(false);
  const [hasNoBudget, setHasNoBudget] = useState(false);

  const [summary, setSummary] = useState({
    budget_amount: 0,
    total_income: 0,
    total_expense: 0,
    total_savings: 0,
    days_remaining: 0,
    cycle_start_date: '',
    cycle_end_date: ''
  });

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const fetchSummary = async () => {
    try {
      const response = await fetch('/analytics/summary', { headers: authHeader() });

      if (response.status === 400) {
        // No budget found
        setHasNoBudget(true);
        setLoading(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setSummary({
          budget_amount: data.budget_amount,
          total_income: data.total_income,
          total_expense: data.total_expense,
          total_savings: data.total_savings,
          days_remaining: data.days_remaining,
          cycle_start_date: data.cycle_start_date,
          cycle_end_date: data.cycle_end_date
        });
        setHasNoBudget(false);
      }
    } catch (e) {
      console.error('Error fetching summary:', e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/transactions/', { headers: authHeader() });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (e) {
      console.error('Error fetching transactions:', e);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/categories/', { headers: authHeader() });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSummary(),
        fetchTransactions(),
        fetchCategories()
      ]);
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smart handler - calls initialize or update based on state
  const handleConfirmBudget = async (newAmount, newDuration) => {
    try {
      // Determine if this is initial setup or edit
      const isInitialSetup = hasNoBudget || !summary.budget_amount || summary.budget_amount === 0;

      const endpoint = isInitialSetup ? '/budget/initialize' : '/budget/';
      const method = isInitialSetup ? 'POST' : 'PUT';

      const body = isInitialSetup
        ? {
          budget_amount: parseFloat(newAmount),
          cycle_duration: newDuration ? parseInt(newDuration) : 30,
          start_date: new Date().toISOString().split('T')[0]
        }
        : {
          budget_amount: parseFloat(newAmount),
          cycle_duration: newDuration ? parseInt(newDuration) : undefined
        };

      const response = await fetch(endpoint, {
        method: method,
        headers: authHeader(),
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchSummary();
        await fetchCategories(); // Refresh categories (created during initialize)
        await fetchTransactions();
        setIsEditOpen(false);
        setHasNoBudget(false);
      } else {
        const error = await response.json();
        alert(`Failed to ${isInitialSetup ? 'create' : 'update'} budget: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error with budget:', error);
      alert('Failed to process budget');
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      const response = await fetch('/transactions/', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
          description: transactionData.description,
          amount: parseFloat(transactionData.amount),
          type: transactionData.type,
          category_id: parseInt(transactionData.category), // ← Note: category becomes category_id
          transaction_date: transactionData.transaction_date || new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        await fetchTransactions();
        await fetchSummary();
        setIsAddTransaction(false);
      } else {
        const error = await response.json();
        alert(`Failed to add transaction: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f5f5f5] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-xl">Loading Budget Tracker...</p>
        </div>
      </div>
    );
  }

  // Show setup screen if no budget
  if (hasNoBudget) {
    return (
      <div className="flex min-h-screen bg-[#f5f5f5] font-sans text-gray-800">
        <Navbar />
        <main className="flex-1 lg:ml-48 p-4 md:p-8 w-full">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to Budget Tracker!</h2>
              <p className="text-gray-600 mb-6">
                You haven't set up your budget yet. Let's get started by setting your budget amount and cycle duration!
              </p>
              <button
                onClick={() => setIsEditOpen(true)}
                className="bg-gray-800 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-700 transition-colors"
              >
                Set Up Budget
              </button>
            </div>
          </div>

          <EditBudgetModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onConfirm={handleConfirmBudget}
            currentBudget={0}
            isInitialSetup={true}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] font-sans text-gray-800">
      <Navbar />

      <main className="flex-1 lg:ml-48 p-4 md:p-8 w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black">Budget Tracker</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Summary Cards */}
            <section className="bg-gray-400 p-6 rounded-3xl shadow-md">
              <div className="flex justify-between items-center mb-4 text-white">
                <h2 className="text-xl font-semibold">My Budget</h2>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="bg-white/20 hover:bg-white/40 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  + Edit Budget
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard label="Total Budget" value={summary.budget_amount} />
                <SummaryCard label="Income" value={summary.total_income} />
                <SummaryCard label="Expense" value={summary.total_expense} />
                <SummaryCard label="Total Savings" value={summary.total_savings} />
              </div>

              {/* Days Remaining */}
              {summary.cycle_start_date && summary.cycle_end_date && (
                <div className="mt-4 text-white text-sm">
                  <p className="font-medium">
                    {summary.days_remaining} days remaining in this cycle
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(summary.cycle_start_date).toLocaleDateString()} - {new Date(summary.cycle_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </section>

            {/* Transaction List */}
            <section className="bg-gray-400 p-6 rounded-3xl shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-white gap-4">
                <h2 className="text-xl font-semibold">Transactions</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="flex-1 sm:flex-none bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                  >
                    Monthly Report
                  </button>
                  <button
                    onClick={() => setIsAddTransaction(true)}
                    className="flex-1 sm:flex-none bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  >
                    + Add Transaction
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {transactions.length > 0 ? transactions.map((t) => (
                  <div key={t.id} className="flex justify-between text-white border-b border-white/10 pb-2">
                    <div className="flex-1">
                      <p className="text-sm font-bold">{t.description}</p>
                      <div className="flex gap-3 text-[10px] opacity-60 mt-1">
                        <span>{t.category?.name || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{new Date(t.transaction_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-300' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}₱{Number(t.amount).toLocaleString()}
                    </span>
                  </div>
                )) : (
                  <p className="text-center text-white/20 italic py-10">No transactions yet</p>
                )}
              </div>
            </section>

            {/* Spending Over Time Chart */}
            <section className="bg-gray-400 rounded-3xl shadow-md overflow-hidden">
              <h2 className="text-xl font-semibold text-white px-6 pt-6 pb-4">Spending Over Time</h2>
              <div className="w-full">
                <AreaChart data={transactions} />
              </div>
            </section>
          </div>

          {/* Sidebar Chart */}
          <div className="lg:col-span-1">
            <ExpenseChart transactions={transactions} />
          </div>
        </div>

        <EditBudgetModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onConfirm={handleConfirmBudget}
          currentBudget={summary.budget_amount}
          isInitialSetup={false}
        />

        <MonthlyReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          summary={summary}
        />

        <AddTransactionModal
          isOpen={isAddTransaction}
          onClose={() => setIsAddTransaction(false)}
          onConfirm={handleAddTransaction}
          categories={categories}  
        />
      </main>
    </div>
  );
}

function SummaryCard({ label, value = 0 }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <p className="text-[10px] font-bold text-gray-400 uppercase truncate">{label}</p>
      <p className="text-lg md:text-xl font-black mt-1 text-gray-800 truncate">
        ₱{(Number(value) || 0).toLocaleString()}
      </p>
    </div>
  );
}