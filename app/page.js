'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [total, setTotal] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem({ name: '', price: '' });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = collection(db, 'items');
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Calculate total
      const totalPrice = itemsArr.reduce(
        (sum, item) => sum + parseFloat(item.price),
        0
      );
      setTotal(totalPrice);
    });
    return () => unsubscribe();
  }, []);

  // Delete item from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <div className='z-10 w-full max-w-3xl items-center justify-between font-mono text-sm '>
        <h1 className='text-4xl p-4 text-center font-bold'>Expense Tracker</h1>
        <label className="relative inline-flex items-center cursor-pointer mb-4">
          <input
            className="sr-only peer"
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <div className="w-24 h-12 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-10 before:w-10 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-10 after:h-10 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0"></div>
        </label>
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <form className='grid grid-cols-6 items-center mb-4'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className={`col-span-3 p-3 border rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-600 bg-gray-800 text-white focus:ring-gray-500' : 'border-gray-300 bg-white text-black focus:ring-blue-500'}`}
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className={`col-span-2 p-3 border rounded-lg focus:outline-none focus:ring-2 mx-3 ${darkMode ? 'border-gray-600 bg-gray-800 text-white focus:ring-gray-500' : 'border-gray-300 bg-white text-black focus:ring-blue-500'}`}
              type='number'
              placeholder='Enter ₹ Price'
            />
            <button
              onClick={addItem}
              className='text-white bg-blue-500 hover:bg-blue-600 p-3 text-xl rounded-lg'
              type='submit'
            >
              +
            </button>
          </form>
          <ul className='space-y-4'>
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex justify-between rounded-lg p-4 shadow-sm ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              >
                <div className='flex justify-between w-full'>
                  <span className='capitalize'>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-8 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <div className='flex justify-between p-3 mt-4 border-t border-gray-300'>
              <span className='font-bold'>Total</span>
              <span className='font-bold'>₹{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
