const projectRepository = require('../repositories/projectRepository');

class ProjectService {
  async createProject(name, ownerId) {
    // Generate a simple unique join code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const project = await projectRepository.create({
      name,
      joinCode,
      ownerId,
      members: [ownerId]
    });

    // Add to user's joined projects
    await projectRepository.addProjectToUser(ownerId, project._id);

    return project;
  }

  async joinProject(joinCode, userId) {
    const project = await projectRepository.findByJoinCode(joinCode);
    
    if (!project) {
      throw new Error('Project not found with this join code');
    }

    if (project.members.includes(userId)) {
      throw new Error('User already a member of this project');
    }

    const updatedProject = await projectRepository.addMember(project._id, userId);
    await projectRepository.addProjectToUser(userId, project._id);

    return updatedProject;
  }

  async leaveProject(projectId, userId) {
    const project = await projectRepository.findById(projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Optional: prevent owner from leaving without transferring ownership
    if (project.ownerId.toString() === userId.toString()) {
      throw new Error('Owner cannot leave the project directly');
    }

    const updatedProject = await projectRepository.removeMember(projectId, userId);
    await projectRepository.removeProjectFromUser(userId, projectId);

    return updatedProject;
  }
}

module.exports = new ProjectService();
