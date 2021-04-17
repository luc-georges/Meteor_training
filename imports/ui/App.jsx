import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';

export const App = () => {
  //get collection and sort it , starting from the most recent one
  const tasks = useTracker(() => TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch());
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

  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <TaskForm/>
      <ul>
        { tasks.map(task => <Task
          key={ task._id } 
          task={ task } 
          onCheckboxClick={toggleChecked}
          onDeleteClick={deleteTask} />) }
      </ul>
    </div>
  );
};