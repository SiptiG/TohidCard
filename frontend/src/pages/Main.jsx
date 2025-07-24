import { useEffect,useState,useContext } from 'react';
import { AuthCtx } from '../contexts/Auth';
import { get } from '../api';

export default function Main() {
  const { user } = useContext(AuthCtx);
  const [bal,setBal]=useState(null);
  useEffect(()=>{ if(user) get('/api/balance').then(r=>setBal(r.balance)); },[user]);
  if(!user) return <p>please login</p>;
  return <h2>Balance: {bal===null?'…':bal}</h2>;
}
