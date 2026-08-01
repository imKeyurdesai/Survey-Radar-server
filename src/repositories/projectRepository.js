const Project = require('../models/Project');
const User = require('../models/User');

class ProjectRepository {
  async create(projectData) {
    return await Project.create(projectData);
  }

  async findByJoinCode(joinCode) {
    return await Project.findOne({ joinCode });
  }

  async findById(projectId) {
    return await Project.findById(projectId);
  }

  async addMember(projectId, userId) {
    return await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: userId } },
      { new: true }
    );
  }

  async removeMember(projectId, userId) {
    return await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: userId } },
      { new: true }
    );
  }

  async addProjectToUser(userId, projectId) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { joinedProjects: projectId } },
      { new: true }
    );
  }

  async removeProjectFromUser(userId, projectId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { joinedProjects: projectId } },
      { new: true }
    );
  }
}

module.exports = new ProjectRepository();
