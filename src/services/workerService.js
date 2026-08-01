const workerRepository = require('../repositories/workerRepository');

class WorkerService {
  async registerWorker(workerId, projectId, browser, version) {
    const worker = await workerRepository.register({
      workerId,
      projectId,
      browser,
      version,
      status: 'online',
      lastHeartbeat: Date.now()
    });
    return worker;
  }

  async processHeartbeat(workerId) {
    return await workerRepository.updateHeartbeat(workerId);
  }

  async getProjectWorkers(projectId) {
    const workers = await workerRepository.getWorkersByProject(projectId);
    
    // Determine status dynamically based on lastHeartbeat
    const now = Date.now();
    const TIMEOUT_MS = 60000; // 1 minute timeout for offline

    return workers.map(worker => {
      const isOnline = (now - new Date(worker.lastHeartbeat).getTime()) < TIMEOUT_MS;
      return {
        ...worker.toObject(),
        status: isOnline ? 'online' : 'offline'
      };
    });
  }
}

module.exports = new WorkerService();
