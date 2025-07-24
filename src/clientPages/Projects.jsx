'use client';

import React, { useState, useCallback } from 'react';
import ProjectsTable from '@/components/projects/ProjectsTable';
import AddProjectDrawer from '@/components/projects/AddProjectDrawer';
import EditProjectDrawer from '@/components/projects/EditProjectDrawer';

const Projects = React.memo(() => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAdd = useCallback(() => {
    setIsAddMode(true);
    setSelectedProject(null);
    setSidebarOpen(true);
  }, []);

  const handleEdit = useCallback((project) => {
    setIsAddMode(false);
    setSelectedProject(project);
    setSidebarOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setSidebarOpen(false);
    setSelectedProject(null);
    setIsAddMode(false);
  }, []);

  return (
    <>
      <ProjectsTable onAdd={handleAdd} onEdit={handleEdit} />
      <AddProjectDrawer isOpen={sidebarOpen && isAddMode} onClose={handleClose} />
      <EditProjectDrawer
        isOpen={sidebarOpen && !isAddMode && !!selectedProject}
        onClose={handleClose}
        project={selectedProject}
      />
    </>
  );
});

export default Projects;