import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { useAuth } from './AuthContext';

const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
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
    <AccountsContext.Provider value={{ accounts }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => useContext(AccountsContext);

export default AccountsProvider;