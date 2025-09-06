// Local storage utilities for data persistence

export const getProjects = () => {
  const projects = localStorage.getItem('synergysphere_projects');
  return projects ? JSON.parse(projects) : [];
};

export const saveProjects = (projects) => {
  localStorage.setItem('synergysphere_projects', JSON.stringify(projects));
};

export const getTasks = (projectId) => {
  const tasks = localStorage.getItem(`synergysphere_tasks_${projectId}`);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (projectId, tasks) => {
  localStorage.setItem(`synergysphere_tasks_${projectId}`, JSON.stringify(tasks));
};

export const getComments = (projectId) => {
  const comments = localStorage.getItem(`synergysphere_comments_${projectId}`);
  return comments ? JSON.parse(comments) : [];
};

export const saveComments = (projectId, comments) => {
  localStorage.setItem(`synergysphere_comments_${projectId}`, JSON.stringify(comments));
};

// Initialize with sample data if empty
export const initializeData = () => {
  const projects = getProjects();
  if (projects.length === 0) {
    const sampleProjects = [
      {
        id: 1,
        name: 'Website Redesign',
        description: 'Complete redesign of company website',
        createdAt: new Date().toISOString(),
        createdBy: 'john@example.com'
      },
      {
        id: 2,
        name: 'Mobile App Development',
        description: 'Build a cross-platform mobile application',
        createdAt: new Date().toISOString(),
        createdBy: 'jane@example.com'
      }
    ];
    saveProjects(sampleProjects);

    // Add sample tasks
    const sampleTasks1 = [
      {
        id: 1,
        title: 'Design new homepage',
        description: 'Create wireframes and mockups for the new homepage',
        assignee: 'john@example.com',
        dueDate: '2024-01-15',
        status: 'In Progress',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Implement responsive design',
        description: 'Make the website mobile-friendly',
        assignee: 'jane@example.com',
        dueDate: '2024-01-20',
        status: 'To-Do',
        createdAt: new Date().toISOString()
      }
    ];
    saveTasks(1, sampleTasks1);

    const sampleTasks2 = [
      {
        id: 3,
        title: 'Setup development environment',
        description: 'Configure React Native development setup',
        assignee: 'jane@example.com',
        dueDate: '2024-01-10',
        status: 'Done',
        createdAt: new Date().toISOString()
      }
    ];
    saveTasks(2, sampleTasks2);

    // Add sample comments
    const sampleComments1 = [
      {
        id: 1,
        text: 'Great progress on the design!',
        author: 'jane@example.com',
        createdAt: new Date().toISOString()
      }
    ];
    saveComments(1, sampleComments1);
  }
};
