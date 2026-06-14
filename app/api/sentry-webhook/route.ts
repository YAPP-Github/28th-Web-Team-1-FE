import { type NextRequest, NextResponse } from 'next/server'

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID

export const POST = async (req: NextRequest) => {
  const { action, data } = await req.json()

  if (action !== 'triggered') return NextResponse.json({ ok: true })

  const issue = data?.issue
  const title = issue?.title || 'Unknown Error'
  const url = issue?.permalink || ''
  const level = issue?.level || 'error'
  const project = issue?.project?.name || ''
  const levelEmoji = { error: '🔴', warning: '🟡', info: '🔵' }[level as string] ?? '🔴'

  const msgRes = await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: `${levelEmoji} **[${project}] ${title}**\n${url}`
    })
  })

  const msg = await msgRes.json()

  await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages/${msg.id}/threads`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `${levelEmoji} ${title}`.slice(0, 100),
      auto_archive_duration: 1440
    })
  })

  return NextResponse.json({ ok: true })
}
