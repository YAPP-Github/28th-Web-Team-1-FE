'use client'
import { Button } from '@shared/ui'
import { sendKakaoMessageToMe } from '../lib/kakaoShare'

import * as amplitude from '@amplitude/unified'
import { AMPLITUDE_EVENTS } from '@shared/config'

export const MobileKakaoCta = () => {
  const handleClickKakaoCta = () => {
    amplitude.track(AMPLITUDE_EVENTS.KAKAO_CLICKED, { trigger_source: 'floating' })
    sendKakaoMessageToMe()
  }
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-5 md:hidden" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
      <Button type="button" variant="text" size="lg" fullWidth={true} className="text-text-basic rounded-lg border-none bg-[#FEE500] py-3 hover:bg-[#FEE500]/90" onClick={handleClickKakaoCta}>
        카카오톡 나에게 보내기
      </Button>
    </div>
  )
}
