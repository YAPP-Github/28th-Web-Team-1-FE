import { ResumeDetailPage } from '@views/resume_detail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ResumeDetailPage resumeId={id} />
}
