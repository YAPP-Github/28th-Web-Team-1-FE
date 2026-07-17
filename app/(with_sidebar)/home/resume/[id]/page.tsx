import { ResumeEditPage } from '@views/resume_edit'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ResumeEditPage resumeId={id} />
}
