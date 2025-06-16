import { endOfMonth, endOfWeek, endOfYear, isWithinInterval, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text, TextInput } from 'react-native-paper';
import DateFilter from '../../components/DateFilter';
import { db } from '../../config/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function ReportsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [dateFilter, setDateFilter] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = [];
      snapshot.forEach(doc => {
        transactionsData.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsData);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    // Apply date filter
    let result = [...transactions];
    
    if (dateFilter) {
      if (dateFilter.type === 'period') {
        const now = new Date();
        
        switch (dateFilter.value) {
          case 'week':
            result = result.filter(t => 
              isWithinInterval(new Date(t.date), {
                start: startOfWeek(now),
                end: endOfWeek(now)
              })
            );
            break;
          case 'month':
            result = result.filter(t => 
              isWithinInterval(new Date(t.date), {
                start: startOfMonth(now),
                end: endOfMonth(now)
              })
            );
            break;
          case 'year':
            result = result.filter(t => 
              isWithinInterval(new Date(t.date), {
                start: startOfYear(now),
                end: endOfYear(now)
              })
            );
            break;
          default:
            break;
        }
      }
      
      if (dateFilter.type === 'custom') {
        result = result.filter(t => {
          const transactionDate = new Date(t.date);
          const startDate = new Date(dateFilter.start);
          const endDate = new Date(dateFilter.end);
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.accountName && t.accountName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredTransactions(result);
  }, [transactions, searchQuery, dateFilter]);

  // Calculate totals based on filtered transactions
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      {/* Date Filter Component */}
      <DateFilter onFilterChange={(filter) => {
        if (typeof filter === 'string') {
          setDateFilter({ type: 'period', value: filter });
        } else {
          setDateFilter(filter);
        }
      }} />
      
      {/* Selected Date Range Display */}
      {dateFilter && (
        <Text style={styles.dateRangeText}>
          {dateFilter.type === 'period' ? (
            `Showing: This ${dateFilter.value.charAt(0).toUpperCase() + dateFilter.value.slice(1)}`
          ) : (
            `Showing: ${format(new Date(dateFilter.start), 'MMM dd, yyyy')} to ${format(new Date(dateFilter.end), 'MMM dd, yyyy')}`
          )}
        </Text>
      )}
      
      <TextInput
        placeholder="Search by description or account"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Total Income</Text>
            <Text style={[styles.summaryValue, { color: 'green' }]}>
              {formatCurrency(totalIncome)}
            </Text>
          </Card.Content>
        </Card>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Total Expense</Text>
            <Text style={[styles.summaryValue, { color: 'red' }]}>
              {formatCurrency(totalExpense)}
            </Text>
          </Card.Content>
        </Card>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Net Balance</Text>
            <Text style={[styles.summaryValue, { 
              color: netBalance >= 0 ? 'green' : 'red' 
            }]}>
              {formatCurrency(netBalance)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.transactionCard}>
            <Card.Content>
              <Text variant="titleMedium">{item.description}</Text>
              <View style={styles.transactionDetails}>
                <Text>{formatDate(item.date)}</Text>
                <Text 
                  style={{ 
                    color: item.type === 'income' ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}
                >
                  {formatCurrency(item.amount)}
                </Text>
              </View>
              <Text>Account: {item.accountName}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dateRangeText: {
    textAlign: 'center',
    marginVertical: 5,
    fontWeight: 'bold',
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  summaryTitle: {
    fontSize: 12,
    color: 'gray',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  search: {
    marginVertical: 10,
    backgroundColor: 'white',
  },
  transactionCard: {
    marginBottom: 10,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});