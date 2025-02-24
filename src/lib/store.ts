import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  projectId: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
}

interface Store {
  user: User | null;
  projects: Project[];
  tasks: Task[];
  setUser: (user: User | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'userId'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      projects: [],
      tasks: [],
      setUser: (user) => set({ user }),
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              userId: state.user?.id || '',
            },
          ],
        })),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...project } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
        })),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              createdBy: state.user?.id || '',
            },
          ],
        })),
      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'project-storage',
    }
  )
);