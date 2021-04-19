import { Meteor } from 'meteor/meteor';
import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';

  //delete the task using it ID
  const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);
  //set the isChecked property of the task by his id
  const toggleChecked = ({ _id, isChecked }) =>
  Meteor.call('tasks.setIsChecked', _id, !isChecked);

export const App = () => {

  const user = useTracker(() => Meteor.user());
  const logout = () => Meteor.logout();
  // react hook for completed tasks #Boolean
  const [hideCompleted, setHideCompleted] = useState(false);

  // filter configuration
  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  //filter on pending and user
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };
  //get collection and sort it , starting from the most recent one

  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('tasks');
    //set loading if not ready
    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
      //count remaning tasks
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });



  //show pending tasks if exists 
  const pendingTasksTitle = `${pendingTasksCount ? ` (${pendingTasksCount})` : ''
    }`;

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>
              To Do List
              {pendingTasksTitle}
            </h1>
          </div>
        </div>
      </header>

      <div className="main">
        {user ? (
          <Fragment>
            <div className="user" onClick={logout}>
              {user.username} 🚪
            </div>  
            <TaskForm />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

            {isLoading && <div className="loading">loading...</div>}

            <ul className="tasks">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};