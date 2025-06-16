import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Menu, Text, TextInput } from 'react-native-paper';
import { db } from '../../config/firebaseConfig';
import { useAccounts } from '../../context/AccountsContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function AccountDetailScreen({ route, navigation }) {
  const { accountId } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const { accounts } = useAccounts();
  const { user } = useAuth();
  
  const account = accounts.find(a => a.id === accountId);

  useEffect(() => {
    if (!accountId || !user) return;
    
    const q = query(
      collection(db, 'transactions'),
      where('accountId', '==', accountId),
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
  }, [accountId, user]);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account? All transactions will be deleted too.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: async () => {
          try {
            // Delete all transactions of this account
            const transactionsQuery = query(
              collection(db, 'transactions'),
              where('accountId', '==', accountId),
              where('userId', '==', user.uid)
            );
            const transactionsSnapshot = await getDocs(transactionsQuery);
            transactionsSnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });

            // Delete the account
            await deleteDoc(doc(db, 'accounts', accountId));
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting account: ", error);
            Alert.alert("Error", "Failed to delete account.");
          }
        } }
      ]
    );
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!account) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.accountName}>{account.name}</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton 
              icon="dots-vertical" 
              onPress={() => setMenuVisible(true)} 
            />
          }>
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('EditAccount', { account });
            }} 
            title="Edit Account" 
          />
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              handleDeleteAccount();
            }} 
            title="Delete Account" 
          />
        </Menu>
      </View>

      <Text variant="titleLarge" style={styles.balanceText}>
        Balance: <Text style={{ color: account.balance >= 0 ? 'green' : 'red' }}>
          {formatCurrency(account.balance)}
        </Text>
      </Text>

      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('AddTransaction', { accountId })}
        style={styles.button}
      >
        Add Transaction
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => navigation.navigate('AccountReport', { accountId })}
        style={styles.button}
      >
        View Account Report
      </Button>

      <TextInput
        placeholder="Search transactions"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.transactionCard}>
            <Card.Content>
              <View style={styles.transactionHeader}>
                <Text variant="titleMedium">{item.description}</Text>
                <View style={styles.transactionActions}>
                  <IconButton 
                    icon="pencil" 
                    size={20} 
                    onPress={() => navigation.navigate('EditTransaction', { transaction: item })} 
                  />
                  <IconButton 
                    icon="delete" 
                    size={20} 
                    onPress={async () => {
                      Alert.alert(
                        "Delete Transaction",
                        "Are you sure you want to delete this transaction?",
                        [
                          { text: "Cancel", style: "cancel" },
                          { text: "Delete", onPress: async () => {
                            try {
                              await deleteDoc(doc(db, 'transactions', item.id));
                            } catch (error) {
                              console.error("Error deleting transaction: ", error);
                              Alert.alert("Error", "Failed to delete transaction.");
                            }
                          } }
                        ]
                      );
                    }} 
                  />
                </View>
              </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  balanceText: {
    marginBottom: 15,
    fontWeight: 'bold',
  },
  search: {
    marginVertical: 10,
    backgroundColor: 'white',
  },
  button: {
    marginVertical: 5,
  },
  transactionCard: {
    marginBottom: 10,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionActions: {
    flexDirection: 'row',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});