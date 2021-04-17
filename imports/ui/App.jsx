import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';

export const App = () => {
  
  const user = useTracker(() => Meteor.user());
  // react hook for completed tasks #Boolean
  const [hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = { isChecked: { $ne: true } };
  //get collection and sort it , starting from the most recent one
  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 },
    }).fetch()
  );
  //delete the task using it ID
  const deleteTask = ({ _id }) => TasksCollection.remove(_id);
  //set the isChecked property of the task by his id
  const toggleChecked = ({ _id, isChecked }) => {
    TasksCollection.update(_id, {
      $set: {
        isChecked: !isChecked
      }
    })
  };
  //count remaning tasks
  const pendingTasksCount = useTracker(() =>
    TasksCollection.find(hideCompletedFilter).count()
  );
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
            <TaskForm />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

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