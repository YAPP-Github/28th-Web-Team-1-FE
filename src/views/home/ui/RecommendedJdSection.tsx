'use client'
import { useState, useTransition } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Flex, Grid } from '@radix-ui/themes'
import { formatDate } from '@shared/lib'
import { Button, Text } from '@shared/ui'
import { useJdRecommendationTags, useJdRecommendations, type JdRecommendation, type JdRecommendationTag } from '@entities/jd'

const RECOMMENDATION_SIZE = 6

export const RecommendedJdSection = () => {
  const [selectedTag, setSelectedTag] = useState<JdRecommendationTag | null>(null)
  const [, startTransition] = useTransition()
  const { tags } = useJdRecommendationTags()
  const { recommendations } = useJdRecommendations(selectedTag ? [selectedTag] : [], RECOMMENDATION_SIZE)

  return (
    <Flex direction={'column'} gap={'6'} className={'w-full max-w-215'}>
      <Text as={'p'} variant={'heading2'} color={'text-basic'}>
        아래 공고 이력서 만들어보는건 어때요?
      </Text>

      <Flex direction={'column'} gap={'5'}>
        <Flex gap={'2'}>
          {tags.map(({ tag, name }) => (
            <Button
              key={tag}
              size={'xs'}
              variant={selectedTag === tag ? 'secondary' : 'outline'}
              aria-pressed={selectedTag === tag}
              onClick={() => startTransition(() => setSelectedTag(selectedTag === tag ? null : tag))}
            >
              {name}
            </Button>
          ))}
        </Flex>

        {recommendations.length ? (
          <Grid columns={'2'} gap={'4'}>
            {recommendations.map((jd) => (
              <RecommendedJdCard key={jd.id} jd={jd} />
            ))}
          </Grid>
        ) : (
          <Text as={'p'} variant={'body2'} color={'text-subtler'}>
            추천 공고가 없어요.
          </Text>
        )}
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
          [{jd.companyName}] {jd.title}
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
