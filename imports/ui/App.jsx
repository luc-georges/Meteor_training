import React, {useState} from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  //get collection and sort it , starting from the most recent one
  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? { isChecked: { $ne: true } } : {}, {
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
  // Hide hook used to filter tasks
  

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>Todo list</h1>
          </div>
        </div>
      </header>

      <div className="main">
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
      </div>
    </div>
  );
};