import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Task } from '../lib/store';

export function Tasks() {
  const { tasks, projects, addTask, updateTask, user } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({});

  const userProjects = projects.filter(project => project.userId === user?.id);
  const userTasks = tasks.filter(task => 
    task.createdBy === user?.id || 
    task.assignedTo === user?.id ||
    userProjects.some(p => p.id === task.projectId)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentTask.title || !currentTask.projectId) return;

    if (currentTask.id) {
      updateTask(currentTask.id, currentTask);
    } else {
      addTask({
        title: currentTask.title,
        description: currentTask.description || '',
        status: 'todo',
        priority: currentTask.priority || 'medium',
        dueDate: currentTask.dueDate || new Date().toISOString(),
        projectId: currentTask.projectId,
        assignedTo: user?.id || '',
      });
    }
    setIsEditing(false);
    setCurrentTask({});
  }

  const tasksByStatus = {
    todo: userTasks.filter(t => t.status === 'todo'),
    'in-progress': userTasks.filter(t => t.status === 'in-progress'),
    completed: userTasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => {
            setCurrentTask({});
            setIsEditing(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {currentTask.id ? 'Edit Task' : 'New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={currentTask.title || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                  Project
                </label>
                <select
                  id="project"
                  value={currentTask.projectId || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, projectId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a project</option>
                  {userProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={currentTask.description || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  id="due_date"
                  value={currentTask.dueDate?.slice(0, 16) || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, dueDate: new Date(e.target.value).toISOString() })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  value={currentTask.priority || 'medium'}
                  onChange={(e) => setCurrentTask({ ...currentTask, priority: e.target.value as Task['priority'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Todo Column */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-medium text-gray-900 mb-4">To Do</h2>
          <div className="space-y-4">
            {tasksByStatus.todo.map((task) => (
              <div 
                key={task.id} 
                className="bg-white p-4 rounded-lg shadow cursor-pointer"
                onClick={() => {
                  updateTask(task.id, { status: 'in-progress' });
                }}
              >
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                {task.dueDate && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-medium text-gray-900 mb-4">In Progress</h2>
          <div className="space-y-4">
            {tasksByStatus['in-progress'].map((task) => (
              <div 
                key={task.id} 
                className="bg-white p-4 rounded-lg shadow cursor-pointer"
                onClick={() => {
                  updateTask(task.id, { status: 'completed' });
                }}
              >
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                {task.dueDate && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-medium text-gray-900 mb-4">Completed</h2>
          <div className="space-y-4">
            {tasksByStatus.completed.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                {task.dueDate && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}