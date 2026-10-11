import { Suspense, useState, type FormEvent } from 'react'
import { Flex, Skeleton } from '@radix-ui/themes'
import { ArrowUp, ChevronLeft, ChevronRight, CircleCheckBig, Plus, TextAlignStart, X } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { LogoIcon } from '@shared/icon'
import { useExperienceQuestionRoom, useExperienceQuestionRooms, useSendExperienceQuestionRoomMessage, type ExperienceQuestionRoomMessage, type ProjectExperience } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { cn } from '@shared/lib'
import { ExperiencePickerDialog } from './ExperiencePickerDialog'

/**
 * AI 추천 탭의 상세 뷰 묶음. 질문 카드 목록(INDEX)과 선택한 질문방 대화 상세(DETAIL)를 전환한다.
 * 목록은 JD 기준 `useExperienceQuestionRooms`, 상세는 `questionRoomId` 기준 `useExperienceQuestionRoom`로 조회한다.
 */
export const AiView = ({ targetJdId }: { targetJdId: string | null }) => {
  const [view, setView] = useState<'INDEX' | 'DETAIL'>('INDEX')
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)

  return (
    <>
      {view === 'INDEX' && (
        <AiIndexView
          targetJdId={targetJdId}
          onOpen={(questionRoomId) => {
            setActiveQuestionId(questionRoomId)
            setView('DETAIL')
          }}
        />
      )}

      {view === 'DETAIL' && activeQuestionId && <AiDetailView targetJdId={targetJdId} questionRoomId={activeQuestionId} onBack={() => setView('INDEX')} />}
    </>
  )
}

const AiIndexView = ({ targetJdId, onOpen }: { targetJdId: string | null; onOpen: (questionRoomId: string) => void }) => {
  return (
    <Flex direction={'column'} className={'overflow-y-auto'}>
      <Flex gap={'3'}>
        <LogoIcon />

        <Flex direction={'column'} gap={'1'}>
          <Text variant={'headline1'}>SCOOP AI가 채용 공고에 맞는 경험을 분석했어요</Text>
          <Text variant={'label2'} color={'text-subtler'}>
            공고의 담당 업무와 우대 사항에 맞춰 이력서에 꼭 담으면 좋을 경험을 찾았어요
          </Text>
        </Flex>
      </Flex>

      <Spacing size={24} />

      <Flex direction={'column'} className={'gap-2'}>
        {targetJdId ? (
          <Suspense fallback={<AiRecommendQuestions.Skeleton />}>
            <AiRecommendQuestions targetJdId={targetJdId} onOpen={onOpen} />
          </Suspense>
        ) : (
          <Text variant={'label2'} color={'text-subtler'}>
            채용 공고를 연결하면 SCOOP AI가 추천 경험 질문을 생성해 드려요.
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

const AiRecommendQuestions = ({ targetJdId, onOpen }: { targetJdId: string; onOpen: (questionRoomId: string) => void }) => {
  const workspaceId = useWorkspaceId()
  const { questionRooms } = useExperienceQuestionRooms(workspaceId, targetJdId)
  return (
    <>
      {questionRooms.map((room) => (
        <Flex key={room.questionRoomId} align={'center'} className={'bg-element-gray-lighter gap-4 rounded-lg px-4 py-5'} asChild>
          <button className={'shrink-0'} onClick={() => onOpen(room.questionRoomId)}>
            <CircleCheckBig size={20} className={'text-icon-gray-lighter shrink-0'} />

            <Flex direction={'column'} className={'flex-1 gap-2'}>
              <Text variant={'headline2'} className={'line-clamp-2 text-left'}>
                {room.question}
              </Text>
              <Flex>
                <Text variant={'label2'} color={'text-subtler'} className={'shrink-0'}>
                  담당 업무
                </Text>

                <Divider orientation={'vertical'} className={'mx-1.5 my-auto h-2.5 shrink-0'} />

                <Text variant={'label2'} color={'text-subtler'} className={'truncate'}>
                  {room.sourceText}
                </Text>
              </Flex>
            </Flex>

            <ChevronRight size={18} className={'text-icon-gray-light shrink-0'} />
          </button>
        </Flex>
      ))}
    </>
  )
}

AiRecommendQuestions.Skeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((_, index) => (
        <Flex key={index} align={'center'} className={'bg-element-gray-lighter gap-4 rounded-lg px-4 py-5'}>
          <CircleCheckBig size={20} className={'text-icon-gray-lighter shrink-0'} />

          <Flex direction={'column'} className={'flex-1 gap-2'}>
            <Skeleton className={'h-5.5 w-80'} />
            <Flex>
              <Text variant={'label2'} color={'text-subtler'} className={'shrink-0'}>
                담당 업무
              </Text>

              <Divider orientation={'vertical'} className={'mx-1.5 my-auto h-2.5 shrink-0'} />

              <Skeleton className={'h-4.5 w-full'} />
            </Flex>
          </Flex>

          <ChevronRight size={18} className={'text-icon-gray-light shrink-0'} />
        </Flex>
      ))}
    </>
  )
}

/**
 * 질문 카드 상세. 목록에서 선택한 질문방 ID로 단건 조회해 질문·근거 원문과 전체 대화 메시지를 보여준다.
 * 뒤로가기는 `onBack`이 처리하므로 목록은 쿼리 캐시에서 재조회 없이 복귀한다.
 */
const AiDetailView = ({ targetJdId, questionRoomId, onBack }: { targetJdId: string | null; questionRoomId: string; onBack: () => void }) => {
  const workspaceId = useWorkspaceId()

  return (
    <Flex direction={'column'} className={'min-h-0 flex-1'}>
      <Flex align={'center'} gap={'1'} asChild>
        <button onClick={onBack}>
          <ChevronLeft size={18} className={'text-icon-gray-light shrink-0'} />
          <Text variant={'label1'} color={'text-subtle'}>
            질문목록
          </Text>
        </button>
      </Flex>

      <Spacing size={16} />

      <Suspense fallback={<AiDetailViewSkeleton />}>
        <QuestionRoomDetail workspaceId={workspaceId} targetJdId={targetJdId} questionRoomId={questionRoomId} />
      </Suspense>
    </Flex>
  )
}

const QuestionRoomDetail = ({ workspaceId, targetJdId, questionRoomId }: { workspaceId: string; targetJdId: string | null; questionRoomId: string }) => {
  const { room, messages = [] } = useExperienceQuestionRoom(workspaceId, questionRoomId)
  const { mutate: sendMessage, isPending } = useSendExperienceQuestionRoomMessage(workspaceId, questionRoomId)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [content, setContent] = useState('')
  const [selectedExperiences, setSelectedExperiences] = useState<ProjectExperience[]>([])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (isPending) return

    const trimmed = content.trim()
    if (!trimmed && selectedExperiences.length === 0) return

    sendMessage(
      { content: trimmed || null, experienceIds: selectedExperiences.map((experience) => experience.experienceId) },
      {
        onSuccess: () => {
          setContent('')
          setSelectedExperiences([])
        }
      }
    )
  }

  return (
    <Flex direction={'column'} className={'min-h-0 flex-1'}>
      <Flex direction={'column'} className={'gap-2'}>
        <Text variant={'headline1'} className={'line-clamp-2'}>
          {room.question}
        </Text>
        <Flex>
          <Text variant={'label2'} color={'text-subtler'}>
            담당 업무
          </Text>

          <Divider orientation={'vertical'} className={'mx-1.5 my-auto h-2.5'} />

          <Text variant={'label2'} color={'text-subtler'}>
            {room.sourceText}
          </Text>
        </Flex>
      </Flex>

      <Spacing size={20} />
      <Divider color={'gray-10'} />
      <Spacing size={20} />

      <Flex direction={'column'} className={'min-h-0 flex-1 gap-6 overflow-y-auto'}>
        <Flex gap={'3'}>
          <LogoIcon className={'opacity-50'} />
          <Text variant={'body2'} color={'text-subtle'}>
            관련 경험을 입력하면 SCOOP AI가 공고에 맞춰 초안을 작성해 드려요.
          </Text>
        </Flex>
        {messages.map((message) => (message.role === 'USER' ? <UserMessageCard key={message.messageId} message={message} /> : <AiMessageCard key={message.messageId} message={message} />))}
      </Flex>

      <Spacing size={40} />

      <form onSubmit={handleSubmit}>
        <Flex direction={'column'} gap={'4'} p={'4'} className="border-border-subtler bg-element-white shadow-3 h-fit w-full max-w-215 rounded-2xl border">
          {selectedExperiences.length > 0 && (
            <Flex className={'gap-1.5'}>
              {selectedExperiences.map((experience) => (
                <ExperienceChip
                  key={experience.experienceId}
                  experience={experience}
                  onDelete={(experienceId) => {
                    setSelectedExperiences(selectedExperiences.filter((e) => e.experienceId !== experienceId))
                  }}
                />
              ))}
            </Flex>
          )}
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            disabled={isPending}
            placeholder={'‘경험 불러오기’ 버튼을 눌러 내 경험 데이터를 불러오거나, 관련 경험을 편하게 적어주세요.'}
            className={cn(
              'field-sizing-content',
              'max-h-24 min-h-12',
              'text-body2 text-text-basic',
              'resize-none overflow-y-auto outline-none',
              'placeholder:text-body2 placeholder:text-text-subtler',
              'disabled:opacity-50'
            )}
          />
          <Flex>
            <Button type={'button'} variant={'tertiary'} size={'xs'} className="flex gap-1 rounded-full" onClick={() => setIsPickerOpen(true)} disabled={isPending}>
              <Plus size={12} />
              경험불러오기
            </Button>
            <Button type={'submit'} aria-label="경험 전송" variant={'primary'} size={'icon-xs'} className="ml-auto" disabled={isPending || (!content.trim() && selectedExperiences.length === 0)}>
              <ArrowUp size={12} />
            </Button>
          </Flex>
        </Flex>
      </form>
      {/*Todo: selectedExperiences에 대한 처리 (연동) */}
      {targetJdId && (
        <ExperiencePickerDialog
          isOpen={isPickerOpen}
          onOpenChange={setIsPickerOpen}
          tab={'AI_RECOMMENDATION'}
          jdId={targetJdId}
          questionRoomId={questionRoomId}
          onComplete={(experiences) => {
            setSelectedExperiences(experiences)
            setIsPickerOpen(false)
          }}
        />
      )}
    </Flex>
  )
}

const UserMessageCard = ({ message }: { message: ExperienceQuestionRoomMessage }) => (
  <Flex direction={'column'} className={'gap-2.5'}>
    <Flex wrap={'wrap'} justify={'end'} className={'gap-1.5'}>
      {/* TODO: title 교체*/}
      {message.experienceIds?.map((experienceId) => (
        <ExperienceChip key={experienceId} experience={{ experienceId, title: experienceId }} />
      ))}
    </Flex>
    {message.content && (
      <Text variant={'body2'} className={'bg-element-gray-lighter ml-auto w-fit max-w-100 rounded-md px-4 py-3 whitespace-pre-wrap'}>
        {message.content}
      </Text>
    )}
  </Flex>
)

interface ExperienceChipProps {
  experience: Pick<ProjectExperience, 'experienceId' | 'title'>
  onDelete?: (experienceId: string) => void
}

const ExperienceChip = ({ experience, onDelete }: ExperienceChipProps) => {
  return (
    <Flex align={'center'} className={'text-text-primary-basic bg-element-white border-border-primary-light flex max-w-[calc(50%-3px)] gap-1.5 rounded-sm border px-2 py-1'}>
      <TextAlignStart size={12} data-icon="inline-start" />
      <Text variant={'label2'}>{experience.title}</Text>

      {onDelete && (
        <button onClick={() => onDelete(experience.experienceId)}>
          <X size={12} />
        </button>
      )}
    </Flex>
  )
}

const AiMessageCard = ({ message }: { message: ExperienceQuestionRoomMessage }) => (
  <Flex gap={'3'}>
    <LogoIcon className={'shrink-0 opacity-50'} />

    <Flex direction={'column'} className={'gap-2.5'}>
      <Flex direction={'column'} className={'border-border-subtle bg-element-white h-fit w-full gap-3 rounded-2xl border px-4 pt-3 pb-4'}>
        <Flex justify={'between'} align={'center'}>
          <Text variant={'label1'} color={'text-primary-basic'}>
            초안 1
          </Text>
          <Button size={'xs'}>이력서에 적용</Button>
        </Flex>

        <Divider color={'gray-10'} />

        {message.block && (
          <Flex direction={'column'}>
            <Text variant={'label1'}>{message.block.title}</Text>

            <Spacing size={12} />
            {message.block.bullets.map((bullet, index) => (
              <Flex key={index} className={'gap-2'}>
                <Text variant={'body2'} color={'text-subtler'}>
                  •
                </Text>
                <Text variant={'body2'} className={'whitespace-pre-wrap'}>
                  {bullet}
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>

      {message.feedback && (
        <Flex direction={'column'}>
          <Text variant={'body2'} className={'whitespace-pre-wrap'}>
            {message.feedback.fit}
          </Text>
          <Text variant={'body2'} className={'whitespace-pre-wrap'}>
            {message.feedback.improvement}
          </Text>
        </Flex>
      )}
    </Flex>
  </Flex>
)

const AiDetailViewSkeleton = () => (
  <>
    <Flex direction={'column'} className={'gap-2'}>
      <Skeleton className={'h-6.25 w-80'} />
      <Flex>
        <Text variant={'label2'} color={'text-subtler'} className={'shrink-0'}>
          담당 업무
        </Text>

        <Divider orientation={'vertical'} className={'mx-1.5 my-auto h-2.5'} />

        <Skeleton className={'h-4.5 w-full'} />
      </Flex>
    </Flex>
    <Spacing size={20} />
    <Divider color={'gray-10'} />
    <Spacing size={20} />
  </>
)
