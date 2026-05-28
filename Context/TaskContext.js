import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import {
  collection, query, where, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) { setTasks([]); return; }
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const createTask = async (title, priority, category, dueDate = '') => {
    await addDoc(collection(db, 'tasks'), {
      userId: user.uid, title, priority, category,
      dueDate, status: 'pending', subtasks: [],
      createdAt: serverTimestamp(),
    });
  };

  const updateTaskItem = async (id, updates) => {
    await updateDoc(doc(db, 'tasks', id), updates);
  };

  const deleteTaskItem = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  return (
    <TaskContext.Provider value={{ tasks, createTask, updateTaskItem, deleteTaskItem }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => useContext(TaskContext);