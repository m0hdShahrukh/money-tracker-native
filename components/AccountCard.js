import { StyleSheet, View } from 'react-native'; // Add View import
import { Card, IconButton, Paragraph, Title } from 'react-native-paper';
import { formatCurrency } from '../utils/helpers';

export default function AccountCard({ account, onPress, onEdit }) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{account.name}</Title>
          <IconButton 
            icon="pencil" 
            size={20} 
            onPress={onEdit} 
          />
        </View>
        <Paragraph style={[styles.balance, { 
          color: account.balance >= 0 ? 'green' : 'red' 
        }]}>
          {formatCurrency(account.balance)}
        </Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balance: {
    fontWeight: 'bold',
    marginTop: 5,
  },
});