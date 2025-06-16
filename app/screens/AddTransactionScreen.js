import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';
import { db } from '../../config/firebaseConfig';
import { useAccounts } from '../../context/AccountsContext';
import { useAuth } from '../../context/AuthContext';

export default function AddTransactionScreen({ route, navigation }) {
  const { accountId } = route.params;
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { accounts } = useAccounts();
  
  const account = accounts.find(a => a.id === accountId);

  const handleSave = async () => {
    if (!description || !amount) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'transactions'), {
        description,
        amount: parseFloat(amount),
        type,
        accountId,
        accountName: account?.name || 'Unknown',
        userId: user.uid,
        date: new Date().toISOString()
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving transaction: ", error);
      Alert.alert("Error", "Failed to save transaction: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Add New Transaction
      </Text>
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <RadioButton.Group onValueChange={value => setType(value)} value={type}>
        <View style={styles.radioGroup}>
          <View style={styles.radioOption}>
            <RadioButton value="expense" />
            <Text>Expense</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="income" />
            <Text>Income</Text>
          </View>
        </View>
      </RadioButton.Group>
      <Button 
        mode="contained" 
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Save Transaction
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  button: {
    marginTop: 10,
  },
});