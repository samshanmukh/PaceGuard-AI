import { comparableCases } from "@/data/seed";
import type { ComparableCase } from "@/lib/types";

export interface AthleteMemoryProvider {
  name: string;
  search(query: string, limit?: number): Promise<ComparableCase[]>;
}

const tokenize = (value: string) =>
  new Set(value.toLowerCase().split(/[^a-z0-9+%]+/).filter((token) => token.length > 2));

export class LocalSemanticMemory implements AthleteMemoryProvider {
  name = "Local semantic fallback";

  async search(query: string, limit = 3): Promise<ComparableCase[]> {
    const queryTokens = tokenize(query);
    return comparableCases
      .map((record) => {
        const corpus = tokenize(
          [record.profile, ...record.matchedOn, ...record.tags, record.intervention].join(" "),
        );
        const overlap = [...queryTokens].filter((token) => corpus.has(token)).length;
        return { record, score: record.similarity + overlap * 2 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ record }) => record);
  }
}

export class QdrantAthleteMemory implements AthleteMemoryProvider {
  name = "Qdrant athlete memory";

  constructor(
    private readonly url: string,
    private readonly apiKey: string,
  ) {}

  async search(_query: string, _limit = 3): Promise<ComparableCase[]> {
    // Production adapter seam. The offline demo deliberately never sends athlete data.
    // Replace with a collection-scoped Qdrant query after provisioning credentials.
    void this.url;
    void this.apiKey;
    return new LocalSemanticMemory().search(_query, _limit);
  }
}

export function getMemoryProvider(): AthleteMemoryProvider {
  const url = process.env.QDRANT_URL;
  const apiKey = process.env.QDRANT_API_KEY;
  return url && apiKey
    ? new QdrantAthleteMemory(url, apiKey)
    : new LocalSemanticMemory();
}
