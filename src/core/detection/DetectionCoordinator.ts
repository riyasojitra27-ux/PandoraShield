import { DetectionResult } from '../model/DetectionResult';

export interface DetectionCoordinator {
  analyzeText(text: string): Promise<DetectionResult>;
  analyzeUrl(url: string): Promise<DetectionResult>;
}
