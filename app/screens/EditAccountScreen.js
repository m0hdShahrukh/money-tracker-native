import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { db } from '../../config/firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export default function EditAccountScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Check if account exists in route params
  const account = route.params?.account;
  
  if (!account) {
    return (
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Account Not Found
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const [name, setName] = useState(account.name);
  const [balance, setBalance] = useState(account.balance.toString());
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!name || !balance) return;
    setLoading(true);

    try {
      await updateDoc(doc(db, 'accounts', account.id), {
        name,
        balance: parseFloat(balance),
        userId: user.uid
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating account: ", error);
      Alert.alert("Error", "Failed to update account: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Edit Account
      </Text>
      <TextInput
        label="Account Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Balance"
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
        Save Changes
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