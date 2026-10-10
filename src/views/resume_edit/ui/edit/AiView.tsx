import { Suspense, useState } from 'react'
import { Flex, Skeleton } from '@radix-ui/themes'
import { ArrowUp, ChevronLeft, ChevronRight, CircleCheckBig, Plus, TextAlignStart } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
import { LogoIcon } from '@shared/icon'
import { useExperienceQuestionRoom, useExperienceQuestionRooms, type ExperienceQuestionRoomMessage } from '@entities/experience'
import { useWorkspaceId } from '@entities/user'
import { cn } from '@shared/lib'

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

      {view === 'DETAIL' && activeQuestionId && <AiDetailView questionRoomId={activeQuestionId} onBack={() => setView('INDEX')} />}
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
const AiDetailView = ({ questionRoomId, onBack }: { questionRoomId: string; onBack: () => void }) => {
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
        <QuestionRoomDetail workspaceId={workspaceId} questionRoomId={questionRoomId} />
      </Suspense>
    </Flex>
  )
}

const QuestionRoomDetail = ({ workspaceId, questionRoomId }: { workspaceId: string; questionRoomId: string }) => {
  const { room, messages = [] } = useExperienceQuestionRoom(workspaceId, questionRoomId)

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

        <AiMessageCard
          key={room.questionRoomId}
          message={{
            messageId: room.questionRoomId,
            role: 'AI',
            content: room.question,
            block: {
              title: 'LLM 출력 품질 기준을 정의하고 프롬프트를 개선해 이력서 생성 품질 고도화',
              bullets: [
                'LLM의 출력 품질을 평가하기 위해 출력 구조, 내용 적합성, 문장 품질 등의 평가 기준을 정의했습니다.',
                '누락·형식 오류·내용 부적합 등의 문제를 유형화하고 프롬프트의 출력 제약조건에 반영했습니다.',
                '동일한 입력값으로 개선 전후 결과를 비교하며 생성 품질을 검증함.'
              ]
            },
            feedback: {
              fit: '이 경험은 공고의 담당 업무와 우대 사항에 부합하는 경험이에요.',
              improvement: '이 경험을 더 잘 보여주기 위해, 경험의 결과와 성과를 구체적으로 작성하면 좋아요.'
            },
            createdAt: '2023-01-01T00:00:00Z',
            experienceIds: []
          }}
        />
        <UserMessageCard
          key={room.questionRoomId + 1}
          message={{
            messageId: room.questionRoomId,
            role: 'USER',
            content: room.question,
            block: {
              title: '근거',
              bullets: room.sourceText.split('\n').filter((line) => line.trim() !== '')
            },
            feedback: {
              fit: '이 경험은 공고의 담당 업무와 우대 사항에 부합하는 경험이에요.',
              improvement: '이 경험을 더 잘 보여주기 위해, 경험의 결과와 성과를 구체적으로 작성하면 좋아요.'
            },
            createdAt: '2023-01-01T00:00:00Z',
            experienceIds: []
          }}
        />
        {messages.map((message) => (message.role === 'USER' ? <UserMessageCard key={message.messageId} message={message} /> : <AiMessageCard key={message.messageId} message={message} />))}
      </Flex>

      <Spacing size={40} />

      <form onSubmit={() => {}}>
        <Flex direction={'column'} gap={'4'} p={'4'} className="border-border-subtler bg-element-white shadow-3 h-fit w-full max-w-215 rounded-2xl border">
          {/*Todo: 경험 불러오기 버튼 클릭 시, 경험 선택 모달을 열고 선택한 경험을 textarea에 채워주는 기능 구현*/}
          <textarea
            placeholder={'‘경험 불러오기’ 버튼을 눌러 내 경험 데이터를 불러오거나, 관련 경험을 편하게 적어주세요.'}
            className={cn(
              'field-sizing-content',
              'max-h-24 min-h-12',
              'text-body2 text-text-basic',
              'resize-none overflow-y-auto outline-none',
              'placeholder:text-body2 placeholder:text-text-subtler'
            )}
          />
          <Flex>
            <Button type={'button'} variant={'tertiary'} size={'xs'} className="flex gap-1 rounded-full">
              <Plus size={12} />
              경험불러오기
            </Button>
            <Button type={'submit'} aria-label="경험 전송" variant={'primary'} size={'icon-xs'} className="ml-auto">
              <ArrowUp size={12} />
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  )
}

const UserMessageCard = ({ message }: { message: ExperienceQuestionRoomMessage }) => (
  <Flex direction={'column'} className={'gap-2.5'}>
    <Flex justify={'end'} className={'gap-1.5'}>
      <Button variant={'secondary'} size={'xs'}>
        <TextAlignStart size={12} data-icon="inline-start" />
        AI 이력서 첨삭 서비스 프롬프트 개선
      </Button>
    </Flex>
    <Text variant={'body2'} className={'bg-element-gray-lighter ml-auto w-fit max-w-100 rounded-md px-4 py-3 whitespace-pre-wrap'}>
      {message.content}
    </Text>
  </Flex>
)

const AiMessageCard = ({ message }: { message: ExperienceQuestionRoomMessage }) => (
  <Flex gap={'3'}>
    <LogoIcon className={'opacity-50'} />

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
