export interface ThreatEntry {
  indicator: string;
  category: string;
  confidence: number;
}

export interface ThreatIntelRepository {
  lookup(indicator: string): Promise<ThreatEntry | null>;
}

export class LocalThreatIntelRepository implements ThreatIntelRepository {
  private localDatabase: Map<string, ThreatEntry> = new Map();

  async lookup(indicator: string): Promise<ThreatEntry | null> {
    // Offline local lookup only, zero cloud telemetry
    return this.localDatabase.get(indicator) || null;
  }
}
