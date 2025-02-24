import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Project } from '../lib/store';

export function Projects() {
  const { projects, addProject, updateProject, deleteProject, user } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentProject.name) return;

    if (currentProject.id) {
      updateProject(currentProject.id, currentProject);
    } else {
      addProject({
        name: currentProject.name,
        description: currentProject.description || '',
        status: 'active',
      });
    }
    setIsEditing(false);
    setCurrentProject({});
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    deleteProject(id);
  }

  const filteredProjects = projects.filter(project => project.userId === user?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => {
            setCurrentProject({});
            setIsEditing(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {currentProject.id ? 'Edit Project' : 'New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={currentProject.name || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={currentProject.description || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
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

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProjects.map((project) => (
            <li key={project.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentProject(project);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {filteredProjects.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No projects found. Create your first project!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}