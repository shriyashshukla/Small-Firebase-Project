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

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-8 bg-gray-100'>
      <div className='z-10 w-full max-w-3xl items-center justify-between font-mono text-sm '>
        <h1 className='text-4xl p-4 text-center text-gray-800 font-bold'>Expense Tracker</h1>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <form className='grid grid-cols-6 items-center text-black mb-4'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className='col-span-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mx-3'
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
                className='flex justify-between bg-gray-200 rounded-lg p-4 shadow-sm'
              >
                <div className='flex justify-between w-full'>
                  <span className='capitalize text-gray-700'>{item.name}</span>
                  <span className='text-gray-700'>₹{item.price}</span>
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
              <span className='text-gray-700 font-bold'>Total</span>
              <span className='text-gray-700 font-bold'>₹{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
