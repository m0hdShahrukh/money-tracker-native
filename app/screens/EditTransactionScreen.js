import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';
import { db } from '../../config/firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export default function EditTransactionScreen({ route, navigation }) {
  const { transaction } = route.params;
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [type, setType] = useState(transaction.type);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!description || !amount) return;
    setLoading(true);

    try {
      await updateDoc(doc(db, 'transactions', transaction.id), {
        description,
        amount: parseFloat(amount),
        type,
        userId: user.uid
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating transaction: ", error);
      Alert.alert("Error", "Failed to update transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Edit Transaction
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