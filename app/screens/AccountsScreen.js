import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import AccountCard from '../../components/AccountCard';
import { db } from '../../config/firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export default function AccountsScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'accounts'),
      where('userId', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const accountsData = [];
      snapshot.forEach(doc => {
        accountsData.push({ id: doc.id, ...doc.data() });
      });
      setAccounts(accountsData);
    });

    return unsubscribe;
  }, [user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AccountCard 
            account={item} 
            onPress={() => navigation.navigate('AccountDetail', { accountId: item.id })}
            onEdit={() => navigation.navigate('EditAccount', { account: item })}
          />
        )}
      />
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('AddAccount')}
        style={styles.addButton}
      >
        Add Account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    margin: 10,
  }
});