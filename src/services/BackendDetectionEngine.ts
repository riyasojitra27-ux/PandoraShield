import { DetectionEngine } from './DetectionEngine';
import { DetectionResult } from '../types/detection';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || null;

export class BackendDetectionEngine implements DetectionEngine {
  async analyzeText(text: string): Promise<DetectionResult> {
    if (!API_BASE_URL) {
      throw new Error('Backend URL not configured');
    }

    const response = await fetch(`${API_BASE_URL}/api/analyze/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        inputType: 'MESSAGE'
      })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.normalizeResponse(data, 'MESSAGE');
  }

  async analyzeUrl(url: string): Promise<DetectionResult> {
    if (!API_BASE_URL) {
      throw new Error('Backend URL not configured');
    }

    const response = await fetch(`${API_BASE_URL}/api/analyze/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        inputType: 'URL'
      })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.normalizeResponse(data, 'URL');
  }

  async analyzeScreenshot(image: Blob | File): Promise<DetectionResult> {
    if (!API_BASE_URL) {
      throw new Error('Backend URL not configured');
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('inputType', 'SCREENSHOT');

    const response = await fetch(`${API_BASE_URL}/api/analyze/screenshot`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.normalizeResponse(data, 'SCREENSHOT');
  }

  private normalizeResponse(data: any, inputType: 'MESSAGE' | 'URL' | 'SCREENSHOT'): DetectionResult {
    return {
      id: data.id || 'backend-' + Date.now(),
      timestamp: data.timestamp || Date.now(),
      inputType: data.inputType || inputType,
      riskScore: typeof data.riskScore === 'number' ? data.riskScore : 50,
      severity: data.severity || 'MEDIUM',
      verdict: data.verdict || 'SUSPICIOUS',
      category: data.category || 'General Threat',
      explanation: data.explanation || 'Analyzed via PandoraShield Backend threat intelligence.',
      evidence: Array.isArray(data.evidence) ? data.evidence : [],
      scamChain: Array.isArray(data.scamChain) ? data.scamChain : [],
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      technicalDetails: data.technicalDetails || { model: 'PandoraShield Backend' },
      source: 'BACKEND'
    };
  }
}
