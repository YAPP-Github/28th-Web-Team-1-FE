import * as amplitude from '@amplitude/unified'

let ready: Promise<void> = Promise.resolve()

/**
 * Amplitude(analytics·session replay·experiment) 초기화. instrumentation-client에서 한 번만 호출한다.
 *
 * @param apiKey Amplitude API 키
 * @param deploymentKey Feature Flag용 Experiment deployment 키
 * @example
 * initAmplitude(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, process.env.NEXT_PUBLIC_AMPLITUDE_DEPLOYMENT_KEY)
 */
export const initAmplitude = (apiKey: string, deploymentKey?: string) => {
  ready = amplitude.initAll(apiKey, {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
    experiment: { deploymentKey }
  })
}

/**
 * 초기화가 끝나면 resolve. 그 전엔 `amplitude.experiment()`가 undefined라 플래그 조회 전에 기다려야 한다.
 * 초기화하지 않은 환경(개발 등)에선 바로 resolve된다.
 *
 * @example
 * await whenAmplitudeReady()
 * amplitude.experiment()?.fetch()
 */
export const whenAmplitudeReady = () => ready
