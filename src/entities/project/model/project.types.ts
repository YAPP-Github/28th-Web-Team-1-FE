export interface CreateProjectInput {
  name: string
  summary: string
  role?: string | null
  period?: { startAt?: string | null; endAt?: string | null } | null
}
