import { useState, useEffect } from 'react';
import { DateTime } from "luxon";

export function storeToken(responseObjData) {
    const expiresDate = DateTime.now().plus({seconds: responseObjData.expiresIn})

    localStorage.setItem('token', responseObjData.token);
    localStorage.setItem('expires', JSON.stringify(expiresDate.valueOf() * 1000));
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    localStorage.removeItem('data');
    localStorage.removeItem('dataHash');
    localStorage.removeItem('justSignedIn');
    localStorage.removeItem("authMessage");
}

export function isLoggedIn() {
    if (!localStorage.getItem('token') || !getExpiration()) { return false; }
    return DateTime.now().valueOf() < getExpiration();
}

export function isLoggedOut() {
    return !isLoggedIn();
}

export function getExpiration() {
    const expiresAt = JSON.parse(localStorage.getItem('expires'));
    return expiresAt;
}

export function useAuth() {
    const [authed, setAuthed] = useState(false);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      setAuthed(!!token);
    }, []);
  
    return { authed };
};
