import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { db } from '../../config/firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export default function AddAccountScreen({ navigation }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    console.log("User UID:", user?.uid); // Add this line
    console.log("Account data:", { // Add this line
      name,
      balance: parseFloat(balance),
      userId: user?.uid
    });
    try {
      await addDoc(collection(db, 'accounts'), {
        name,
        balance: parseFloat(balance),
        userId: user.uid
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving account: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Add New Account
      </Text>
      <TextInput
        label="Account Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Initial Balance"
        value={balance}
        onChangeText={setBalance}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Save Account
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
  button: {
    marginTop: 10,
  },
});