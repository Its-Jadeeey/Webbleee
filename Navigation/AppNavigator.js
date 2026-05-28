import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
import TasksListScreen from '../Screens/TasksListScreen';
import TaskScreen from '../Screens/TaskScreen';
import ProfileScreen from '../Screens/ProfileScreen';

export default function AppNavigator({
  currentView,
  setView,
  selectedTaskId,
  setSelectedTaskId,
}) {
  switch (currentView) {
    case 'HOME':
      return (
        <HomeScreen
          setView={setView}
          setSelectedTaskId={setSelectedTaskId}
        />
      );

    case 'TASKS':
      return (
        <TasksListScreen
          setView={setView}
          setSelectedTaskId={setSelectedTaskId}
        />
      );

    case 'TASK_DETAIL':
      return (
        <TaskScreen
          setView={setView}
          taskId={selectedTaskId}
          previousView={currentView}
        />
      );

    case 'PROFILE':
      return <ProfileScreen setView={setView} />;

    default:
      return (
        <HomeScreen
          setView={setView}
          setSelectedTaskId={setSelectedTaskId}
        />
      );
  }
}