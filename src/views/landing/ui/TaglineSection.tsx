import { ScoopIcon } from '@shared/icon'

export const TaglineSection = () => {
  return (
    <section className="flex flex-col gap-8 overflow-hidden bg-white py-16 md:gap-30 md:py-70">
      <p className="text-primary-20 font-elms text-[28px] leading-[1.1] tracking-[-0.02em] sm:text-[40px] md:text-[56px] lg:text-[64px]">Scoop Your Experience •••</p>
      <div className="flex items-center justify-end gap-2 md:gap-4">
        <ScoopIcon size={240} className="text-primary-20 h-auto w-24 shrink-0 sm:w-36 md:w-52 lg:w-60" />
        <p className="text-primary-20 font-elms text-[28px] leading-[1.1] tracking-[-0.02em] sm:text-[40px] md:text-[56px] lg:text-[64px]">Scoop Your Career</p>
      </div>
    </section>
  )
}
