import React, { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn, logout } from '../../services/auth';
import bcrypt from 'bcryptjs';
import useUpdateEffect from '../hooks/useUpdateEffect';

const DataContext = createContext(null);

export function DataProvider(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataObject = localStorage.getItem('data');
    const storedData = JSON.parse(dataObject);
    const hash = localStorage.getItem('dataHash');

    async function checkDataAndHash() {
      let result;
      try {
          result = await bcrypt.compare(dataObject, hash)
      } catch (err) {
        logout();
        throw err
      }

      if (result) {
        console.log("Local data is valid.")
        setData(storedData);
      } else {
        console.log("Local data has been tampered with. Logging out...")
        logout();
      }
    }

    if (isLoggedIn() && storedData && hash) {
      checkDataAndHash();
    } else {
      logout();
    }
  }, []);

  useEffect(() => {
    let dataStringified;
    async function storeDataHash() {
      let hash;
      try {
        hash = await bcrypt.hash(dataStringified, 8)
      } catch (err) {
        logout();
        throw err
      }

      localStorage.setItem('dataHash', hash);
    }

    if (data) {
      dataStringified = JSON.stringify(data);
      localStorage.setItem('data', dataStringified);
      storeDataHash()
    }
  }, [data]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {props.children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
