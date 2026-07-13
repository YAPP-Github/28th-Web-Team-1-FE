import { redirect } from 'next/navigation'
import { userAPI } from '@entities/user'

// workspaceId 없이 진입하면 기본 워크스페이스(me.workspaces[0])로 보낸다.
export default async function ExperiencesRedirect() {
  const { me } = await userAPI.getUserWorkspaces()
  const workspaceId = me.workspaces[0]?.workspaceId
  redirect(workspaceId ? `/workspace/${workspaceId}/experiences` : '/home')
}
