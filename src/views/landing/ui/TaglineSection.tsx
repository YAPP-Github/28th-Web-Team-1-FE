import { ScoopIcon } from '@shared/icon'

export const TaglineSection = () => {
  return (
    <section className="flex flex-col gap-30 bg-white py-70">
      <p className="text-primary-20 font-elms text-[64px] leading-[1.1] tracking-[-0.02em]">Scoop Your Experience •••</p>
      <div className="flex items-center justify-end gap-4">
        <ScoopIcon size={240} className="text-primary-20" />
        <p className="text-primary-20 font-elms text-[64px] leading-[1.1] tracking-[-0.02em]">Scoop Your Career</p>
      </div>
    </section>
  )
}
