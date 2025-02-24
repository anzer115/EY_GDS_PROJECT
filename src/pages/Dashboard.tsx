import React from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../lib/store';

export function Dashboard() {
  const { projects, tasks, user } = useStore();

  const userProjects = projects.filter(project => project.userId === user?.id);
  const userTasks = tasks.filter(task => 
    task.createdBy === user?.id || 
    task.assignedTo === user?.id ||
    userProjects.some(p => p.id === task.projectId)
  );

  const recentProjects = userProjects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingTasks = userTasks
    .filter(task => task.status !== 'completed' && new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            {userTasks.filter(t => t.status === 'completed').length} Tasks Completed
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Calendar className="w-4 h-4 mr-1" />
            {userProjects.length} Active Projects
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
            {recentProjects.length === 0 && (
              <p className="text-gray-500 text-sm">No projects found</p>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="text-gray-500 text-sm">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}