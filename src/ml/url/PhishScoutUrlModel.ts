import { PhishScoutFeatureExtractor } from './PhishScoutFeatureExtractor';
import { TREE_ATTRS } from './treeData';

export interface UrlModel {
  predict(url: string): Promise<number>;
}

export class PhishScoutUrlModel implements UrlModel {
  private nodeMap: Map<string, number>;
  private leafMap: Map<string, number>;
  private numTrees: number;

  constructor() {
    this.nodeMap = new Map();
    const { nodes_treeids, nodes_nodeids, class_treeids, class_nodeids, class_weights } = TREE_ATTRS;

    for (let i = 0; i < nodes_treeids.length; i++) {
      this.nodeMap.set(`${nodes_treeids[i]}_${nodes_nodeids[i]}`, i);
    }

    this.leafMap = new Map();
    for (let i = 0; i < class_treeids.length; i++) {
      this.leafMap.set(`${class_treeids[i]}_${class_nodeids[i]}`, class_weights[i]);
    }

    this.numTrees = Math.max(...nodes_treeids, ...class_treeids) + 1;
  }

  async predict(url: string): Promise<number> {
    const trimmedUrl = url.trim();
    if (trimmedUrl.length === 0) {
      throw new Error('URL cannot be empty');
    }

    const features = PhishScoutFeatureExtractor.extract(trimmedUrl);
    const { nodes_featureids, nodes_values, nodes_truenodeids, nodes_falsenodeids } = TREE_ATTRS;

    let margin = 0.0;
    for (let t = 0; t < this.numTrees; t++) {
      let curNodeId = 0;
      while (true) {
        const leafKey = `${t}_${curNodeId}`;
        if (this.leafMap.has(leafKey)) {
          margin += this.leafMap.get(leafKey)!;
          break;
        }
        const nodeIdx = this.nodeMap.get(`${t}_${curNodeId}`);
        if (nodeIdx === undefined) {
          break;
        }
        const featId = nodes_featureids[nodeIdx];
        const thresh = nodes_values[nodeIdx];
        const val = features[featId];
        if (val <= thresh) {
          curNodeId = nodes_truenodeids[nodeIdx];
        } else {
          curNodeId = nodes_falsenodeids[nodeIdx];
        }
      }
    }

    // Logistic post-transform: 1 / (1 + exp(-margin))
    const prob = 1.0 / (1.0 + Math.exp(-margin));
    return Math.min(1.0, Math.max(0.0, prob));
  }
}
