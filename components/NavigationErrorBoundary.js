import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default class NavigationErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Navigation Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Navigation Error</Text>
          <Text style={styles.message}>
            Something went wrong while navigating. Please try again.
          </Text>
          <Button 
            title="Go Back" 
            onPress={() => {
              this.setState({ hasError: false });
              this.props.navigation?.goBack();
            }} 
          />
        </View>
      );
    }
    
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
});