export interface CreateProjectInput {
  name: string
  summary: string
  period?: { startAt?: string | null; endAt?: string | null } | null
}

export interface UpdateProjectInput {
  name?: string
  role?: string
  summary?: string
  period?: { startAt?: string | null; endAt?: string | null } | null
}
