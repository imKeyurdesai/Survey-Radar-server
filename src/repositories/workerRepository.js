const Worker = require('../models/Worker');

class WorkerRepository {
  async register(workerData) {
    return await Worker.findOneAndUpdate(
      { workerId: workerData.workerId },
      workerData,
      { returnDocument: 'after', upsert: true }
    );
  }

  async updateHeartbeat(workerId) {
    return await Worker.findOneAndUpdate(
      { workerId },
      { lastHeartbeat: Date.now(), status: 'online' },
      { returnDocument: 'after' }
    );
  }

  async getWorkersByProject(projectId) {
    return await Worker.find({ projectId });
  }
}

module.exports = new WorkerRepository();
