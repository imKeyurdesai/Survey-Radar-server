const Worker = require('../models/Worker');

class WorkerRepository {
  async register(workerData) {
    return await Worker.findOneAndUpdate(
      { workerId: workerData.workerId },
      workerData,
      { returnDocument: 'after', upsert: true }
    );
  }

  async updateHeartbeat(workerId, name) {
    const updateData = { lastHeartbeat: Date.now(), status: 'online' };
    if (name !== undefined) {
      updateData.name = name;
    }
    return await Worker.findOneAndUpdate(
      { workerId },
      updateData,
      { returnDocument: 'after' }
    );
  }

  async getWorkersByProject(projectId) {
    return await Worker.find({ projectId });
  }
}

module.exports = new WorkerRepository();
