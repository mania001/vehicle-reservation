type SendSlackInput = {
  text?: string
  blocks?: unknown[]
  channel?: string
}

export async function sendSlack(input: SendSlackInput) {
  const url = process.env.SLACK_WEBHOOK_URL

  if (!url) {
    console.warn('SLACK_WEBHOOK_URL not configured')

    return
  }

  try {
    const res = await fetch(url, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        text: input.text,
        blocks: input.blocks,
        channel: input.channel,
      }),
    })

    if (!res.ok) {
      const body = await res.text()

      console.error('Slack webhook error', body)
    }
  } catch (err) {
    console.error('Slack send failed', err)
  }
}
