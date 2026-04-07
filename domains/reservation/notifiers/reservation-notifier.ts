import { sendSlack } from '@/lib/slack/send-slack'

export async function notifyReservationReturned(input: {
  reservationId: string
  vehicleName: string
  adminName?: string
}) {
  await sendSlack({
    blocks: [
      {
        type: 'header',

        text: {
          type: 'plain_text',

          text: '📦 차량 반납 완료',
        },
      },

      {
        type: 'section',

        fields: [
          {
            type: 'mrkdwn',

            text: `*예약ID*\n${input.reservationId}`,
          },

          {
            type: 'mrkdwn',

            text: `*차량*\n${input.vehicleName}`,
          },

          {
            type: 'mrkdwn',

            text: `*처리자*\n${input.adminName ?? '-'}`,
          },
        ],
      },
    ],
  })
}
