/**
 * Simple K-Means clustering implementation for user profiles
 */
export const UserClusteringService = {
  /**
   * Calculate Euclidean distance between two vectors
   */
  getDistance(v1, v2) {
    let sum = 0;
    const keys = new Set([...Object.keys(v1), ...Object.keys(v2)]);
    for (const key of keys) {
      const val1 = v1[key] || 0;
      const val2 = v2[key] || 0;
      sum += Math.pow(val1 - val2, 2);
    }
    return Math.sqrt(sum);
  },

  /**
   * Extract features from profile for clustering
   */
  extractFeatures(profile) {
    const traits = profile.answers || {};
    // Normalize to 0-1 range
    const normalized = {};
    for (const [key, val] of Object.entries(traits)) {
      normalized[key] = (Number(val) || 0) / 100; // Assuming max score is 100
    }
    return normalized;
  },

  /**
   * K-Means clustering algorithm
   * @param {Array} users Array of user objects
   * @param {number} k Number of clusters (5-7 recommended)
   * @param {number} maxIterations Max iterations to prevent infinite loops
   */
  clusterUsers(users, k = 5, maxIterations = 20) {
    if (!users || users.length === 0) return [];
    if (users.length <= k) return users.map((u, i) => ({ ...u, cluster: i }));

    // Extract features
    const data = users.map(u => ({
      ...u,
      features: this.extractFeatures(u)
    }));

    // Initialize centroids randomly from data points
    let centroids = [];
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    for (let i = 0; i < k; i++) {
      centroids.push({ ...shuffled[i].features });
    }

    let iterations = 0;
    let assignmentsChanged = true;
    let clusters = new Array(k).fill().map(() => []);

    while (assignmentsChanged && iterations < maxIterations) {
      assignmentsChanged = false;
      
      // Clear clusters
      clusters = new Array(k).fill().map(() => []);

      // Assign points to nearest centroid
      for (let i = 0; i < data.length; i++) {
        let minDist = Infinity;
        let bestCluster = 0;

        for (let j = 0; j < k; j++) {
          const dist = this.getDistance(data[i].features, centroids[j]);
          if (dist < minDist) {
            minDist = dist;
            bestCluster = j;
          }
        }

        if (data[i].cluster !== bestCluster) {
          assignmentsChanged = true;
          data[i].cluster = bestCluster;
        }
        clusters[bestCluster].push(data[i]);
      }

      // Update centroids
      for (let i = 0; i < k; i++) {
        if (clusters[i].length === 0) continue;

        const newCentroid = {};
        const keys = Object.keys(clusters[i][0].features);
        
        for (const key of keys) {
          let sum = 0;
          for (const item of clusters[i]) {
            sum += item.features[key] || 0;
          }
          newCentroid[key] = sum / clusters[i].length;
        }
        centroids[i] = newCentroid;
      }

      iterations++;
    }

    // Identify cluster characteristics
    const clusterMetadata = centroids.map((c, i) => {
      // Find top 3 traits for this cluster
      const dominantTraits = Object.entries(c)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);

      return {
        id: i,
        size: clusters[i].length,
        dominantTraits,
        centroid: c
      };
    });

    return {
      assignments: data,
      metadata: clusterMetadata
    };
  },

  /**
   * Find similar users for a given profile
   */
  findSimilarUsers(profile, allUsers, k = 5) {
    const { assignments } = this.clusterUsers([profile, ...allUsers], k);
    const targetCluster = assignments.find(a => a.id === profile.id)?.cluster;
    
    return assignments
      .filter(a => a.cluster === targetCluster && a.id !== profile.id)
      .map(a => {
        const { features, cluster, ...userData } = a;
        return userData;
      });
  }
};