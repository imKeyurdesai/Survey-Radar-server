const workerRepository = require('../repositories/workerRepository');

class WorkerService {
  async registerWorker(workerId, projectId, name, browser, version) {
    const worker = await workerRepository.register({
      workerId,
      projectId,
      name,
      browser,
      version,
      status: 'online',
      lastHeartbeat: Date.now()
    });
    return worker;
  }

  async processHeartbeat(workerId, name) {
    return await workerRepository.updateHeartbeat(workerId, name);
  }

  async getProjectWorkers(projectId) {
    // Purge workers that have been offline for more than 1 week (7 days)
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const cutoffDate = new Date(Date.now() - ONE_WEEK_MS);
    await workerRepository.deleteInactiveWorkers(cutoffDate);

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
