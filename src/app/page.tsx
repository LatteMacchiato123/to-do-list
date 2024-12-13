"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditedTask(tasks[index]);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    });
  };

  const saveEdit = () => {
    if (editedTask.trim()) {
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? editedTask : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
      setEditedTask("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (editIndex !== null) {
        saveEdit();
      } else {
        addTask();
      }
    }
  };
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const inputElement = document.getElementById("task-input");
    if (inputElement) {
      inputElement.addEventListener("keypress", handleKeyPress);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [newTask, editedTask]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl mb-4 p-2 ">To-Do List</h1>

      <div className="flex mb-4">
        <input
          ref={inputRef}
          className="flex-1 p-2 border rounded"
          id="task-input"
          type="text"
          placeholder="Enter a task"
          onChange={(event) =>
            editIndex !== null
              ? setEditedTask(event.target.value)
              : setNewTask(event.target.value)
          }
          value={editIndex !== null ? editedTask : newTask}
        />
        <span
          className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          id="add-task"
          onClick={editIndex !== null ? saveEdit : addTask}
        >
          {" "}
          {editIndex !== null ? "Save" : "Add"}
        </span>
      </div>
      <ul className="mb-4 ">
        {tasks.map((tasks, index) => (
          <li
            key={index}
            className="flex items-center mb-2 p-2 border rounded shadow-sm "
          >
            {
              <input
                type="checkbox"
                className="appereance-none rounded checked:bg-blue-500 checked:border-transparent focus:outline-none mr-2 "
              ></input>
            }
            <div className="flex-1 mx-1">{tasks}</div>

            <div className="flex space-x-2">
              <span
                id="edit-task"
                onClick={() => startEdit(index)}
                className="ml-1 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </span>
              <span
                id="remove-task"
                onClick={() => removeTask(index)}
                className="ml-1 py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600 "
              >
                Remove
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
