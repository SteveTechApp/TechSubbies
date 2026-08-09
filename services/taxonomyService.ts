import { API_BASE_URL } from './apiConfig';
import { secureFetch } from './httpClient';
import type { RoleSkillDefinition } from '../types/roleSkills';

export type TaxonomyVersionStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'superseded';

export type TaxonomyReview = {
  id: string;
  versionId: string;
  reviewerUserId: string;
  decision: 'approved' | 'rejected';
  note: string;
  createdAt: string;
};

export type TaxonomyVersion = {
  id: string;
  roleId: string;
  version: number;
  status: TaxonomyVersionStatus;
  snapshot: RoleSkillDefinition;
  changeNote: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
  reviews: TaxonomyReview[];
};

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = await response.json() as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // Keep the status message.
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export const taxonomyService = {
  async listVersions(roleId?: string): Promise<TaxonomyVersion[]> {
    const query = roleId ? `?roleId=${encodeURIComponent(roleId)}` : '';
    const response = await secureFetch(`${API_BASE_URL}/admin/taxonomy/versions${query}`);
    return (await readJson<{ versions: TaxonomyVersion[] }>(response)).versions;
  },

  async createDraft(input: {
    roleId: string;
    snapshot: RoleSkillDefinition;
    changeNote: string;
  }): Promise<TaxonomyVersion> {
    const response = await secureFetch(`${API_BASE_URL}/admin/taxonomy/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return (await readJson<{ version: TaxonomyVersion }>(response)).version;
  },

  async updateDraft(id: string, input: {
    snapshot: RoleSkillDefinition;
    changeNote: string;
  }): Promise<TaxonomyVersion> {
    const response = await secureFetch(`${API_BASE_URL}/admin/taxonomy/versions/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return (await readJson<{ version: TaxonomyVersion }>(response)).version;
  },

  async submitForReview(id: string): Promise<TaxonomyVersion> {
    const response = await secureFetch(`${API_BASE_URL}/admin/taxonomy/versions/${encodeURIComponent(id)}/submit`, {
      method: 'POST',
    });
    return (await readJson<{ version: TaxonomyVersion }>(response)).version;
  },

  async publish(id: string): Promise<TaxonomyVersion> {
    const response = await secureFetch(`${API_BASE_URL}/admin/taxonomy/versions/${encodeURIComponent(id)}/publish`, {
      method: 'POST',
    });
    return (await readJson<{ version: TaxonomyVersion }>(response)).version;
  },

  async listPendingReviews(): Promise<TaxonomyVersion[]> {
    const response = await secureFetch(`${API_BASE_URL}/taxonomy/reviews/pending`);
    return (await readJson<{ versions: TaxonomyVersion[] }>(response)).versions;
  },

  async review(id: string, decision: 'approved' | 'rejected', note: string): Promise<TaxonomyVersion> {
    const response = await secureFetch(`${API_BASE_URL}/taxonomy/reviews/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, note }),
    });
    return (await readJson<{ version: TaxonomyVersion }>(response)).version;
  },

  async listPublished(): Promise<TaxonomyVersion[]> {
    const response = await secureFetch(`${API_BASE_URL}/taxonomy/published`);
    return (await readJson<{ versions: TaxonomyVersion[] }>(response)).versions;
  },
};
