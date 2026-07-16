/** STAR 형식 경험 상세 내용 (Situation·Task·Action·Result) */
export interface StarContentsInput {
  situation: string
  task: string
  action: string
  result: string
}

/** 경험 상세 내용 입력. STAR 또는 FREE 형식 중 하나를 채운다. */
export interface ExperienceContentsInput {
  type: 'STAR' | 'FREE'
  star?: StarContentsInput | null
  free?: { content: string } | null
}

export interface CreateExperienceInput {
  projectId: string
  title: string
  tags?: string[]
  contents: ExperienceContentsInput
}

export interface UpdateExperienceInput {
  title?: string
  tags?: string[]
  contents?: ExperienceContentsInput
}
