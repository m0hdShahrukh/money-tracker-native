import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';

const DateFilter = ({ onFilterChange }) => {
  const [visible, setVisible] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleFilter = (period) => {
    onFilterChange(period);
    setVisible(false);
  };

  const handleCustomFilter = () => {
    if (customStart && customEnd) {
      onFilterChange({ type: 'custom', start: customStart, end: customEnd });
      setVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <Button 
          mode="outlined" 
          onPress={() => handleFilter('week')}
          style={styles.filterButton}
        >
          This Week
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => handleFilter('month')}
          style={styles.filterButton}
        >
          This Month
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => handleFilter('year')}
          style={styles.filterButton}
        >
          This Year
        </Button>
        <Button 
          mode="contained" 
          onPress={() => setVisible(true)}
          style={styles.filterButton}
        >
          Custom
        </Button>
      </View>

      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <Text variant="titleLarge" style={styles.modalTitle}>
              Custom Date Range
            </Text>
            
            <TextInput
              label="Start Date (YYYY-MM-DD)"
              value={customStart}
              onChangeText={setCustomStart}
              style={styles.input}
              keyboardType="numeric"
            />
            
            <TextInput
              label="End Date (YYYY-MM-DD)"
              value={customEnd}
              onChangeText={setCustomEnd}
              style={styles.input}
              keyboardType="numeric"
            />
            
            <Button 
              mode="contained" 
              onPress={handleCustomFilter}
              style={styles.button}
            >
              Apply Filter
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => setVisible(false)}
              style={styles.button}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  filterButton: {
    marginVertical: 4,
    minWidth: '24%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default DateFilter;