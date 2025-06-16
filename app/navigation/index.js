import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { useAuth } from '../../context/AuthContext';
import AccountDetailScreen from '../screens/AccountDetailScreen';
import AccountReportScreen from '../screens/AccountReportScreen';
import AccountsScreen from '../screens/AccountsScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditAccountScreen from '../screens/EditAccountScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';
import LoginScreen from '../screens/LoginScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SignupScreen from '../screens/SignupScreen';

enableScreens();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Accounts') iconName = 'account-balance';
          else if (route.name === 'Reports') iconName = 'bar-chart';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      {user ? (
        <>
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="AccountDetail" 
            component={AccountDetailScreen} 
            options={{ title: 'Account Details' }} 
          />
          <Stack.Screen 
            name="AddAccount" 
            component={AddAccountScreen} 
            options={{ title: 'Add Account' }} 
          />
          <Stack.Screen 
            name="AddTransaction" 
            component={AddTransactionScreen} 
            options={{ title: 'Add Transaction' }} 
          />
          <Stack.Screen 
            name="AccountReport" 
            component={AccountReportScreen} 
            options={{ title: 'Account Report' }} 
          />
          <Stack.Screen 
            name="EditAccount" 
            component={EditAccountScreen} 
            options={{ title: 'Edit Account' }} 
          />
          <Stack.Screen 
            name="EditTransaction" 
            component={EditTransactionScreen} 
            options={{ title: 'Edit Transaction' }} 
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ title: 'Create Account' }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}