'use client'
import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Flex, Grid } from '@radix-ui/themes'
import { formatDate } from '@shared/lib'
import { Button, Text } from '@shared/ui'

// TODO: 서버 연결 시 schema:pull 후 `jdRecommendationTags` / `jdRecommendations(tags)` 쿼리로 교체 (entities/jd로 이동)
type JdRecommendationTag = 'POPULAR' | 'MAJOR_COMPANY' | 'TECH_COMPANY' | 'EXTERNAL_ACTIVITY'

interface JdRecommendation {
  id: string
  companyName: string
  title: string
  sourceUrl: string
  recruitmentStartAt: string | null
  recruitmentEndAt: string | null
  tags: JdRecommendationTag[] | null
}

const MOCK_TAGS: Array<{ tag: JdRecommendationTag; name: string }> = [
  { tag: 'POPULAR', name: '인기 공고' },
  { tag: 'MAJOR_COMPANY', name: '주요 대기업' },
  { tag: 'TECH_COMPANY', name: '네카라쿠배' },
  { tag: 'EXTERNAL_ACTIVITY', name: '대외활동' }
]

const MOCK_RECOMMENDATIONS: JdRecommendation[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i),
  companyName: 'NAVER',
  title: '[NAVER] 신사업 전략 및 국내외 주요 산업 리서치 (체험형 인턴)',
  sourceUrl: 'https://recruit.navercorp.com',
  recruitmentStartAt: '2026-09-09',
  recruitmentEndAt: '2026-09-27',
  tags: i % 2 ? ['POPULAR', 'TECH_COMPANY'] : ['POPULAR', 'MAJOR_COMPANY']
}))

export const RecommendedJdSection = () => {
  const [selectedTag, setSelectedTag] = useState<JdRecommendationTag | null>(null)
  const recommendations = selectedTag ? MOCK_RECOMMENDATIONS.filter((jd) => jd.tags?.includes(selectedTag)) : MOCK_RECOMMENDATIONS

  return (
    <Flex direction={'column'} gap={'6'} className={'w-full max-w-215'}>
      <Text as={'p'} variant={'heading2'} color={'text-basic'}>
        아래 공고 이력서 만들어보는건 어때요?
      </Text>

      <Flex direction={'column'} gap={'5'}>
        <Flex gap={'2'}>
          {MOCK_TAGS.map(({ tag, name }) => (
            <Button key={tag} size={'xs'} variant={selectedTag === tag ? 'secondary' : 'outline'} aria-pressed={selectedTag === tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}>
              {name}
            </Button>
          ))}
        </Flex>

        <Grid columns={'2'} gap={'4'}>
          {recommendations.map((jd) => (
            <RecommendedJdCard key={jd.id} jd={jd} />
          ))}
        </Grid>
      </Flex>
    </Flex>
  )
}

const RecommendedJdCard = ({ jd }: { jd: JdRecommendation }) => {
  const period = [formatDate(jd.recruitmentStartAt), formatDate(jd.recruitmentEndAt)].filter(Boolean).join(' ~ ')

  return (
    <Flex direction={'column'} gap={'4'} p={'5'} className={'border-border-subtler bg-element-white shadow-2 min-w-0 rounded-lg border'}>
      <Flex direction={'column'} className="gap-1.5">
        <Text as={'p'} variant={'label1'} color={'text-basic'} className={'truncate'}>
          {jd.title}
        </Text>
        {period && (
          <Flex align={'center'} gap={'1'}>
            <CalendarIcon size={12} className={'text-text-subtler'} />
            <Text variant={'caption2'} color={'text-subtler'}>
              {period}
            </Text>
          </Flex>
        )}
      </Flex>

      <Flex gap={'2'}>
        <Button asChild size={'xs'} variant={'secondary'}>
          <a href={jd.sourceUrl} target={'_blank'} rel={'noopener noreferrer'}>
            공고 보기
          </a>
        </Button>
        <Button size={'xs'} variant={'secondary'}>
          이력서 만들기
        </Button>
      </Flex>
    </Flex>
  )
}
