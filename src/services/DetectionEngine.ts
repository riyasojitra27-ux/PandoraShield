import { DetectionResult } from '../types/detection';

export interface DetectionEngine {
  analyzeText(text: string): Promise<DetectionResult>;
  analyzeUrl(url: string): Promise<DetectionResult>;
  analyzeScreenshot(image: Blob | File | string): Promise<DetectionResult>;
}
