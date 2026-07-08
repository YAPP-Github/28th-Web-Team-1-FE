import { Flex, Grid } from '@radix-ui/themes'
import { Button, Text } from '@shared/ui'
import { ExperiencesCard } from './ExperiencesCard'
import { cn } from '@shared/lib/cn'
import { ExperiencesSearchField } from './ExperiencesSearchField'

export const ExperiencesPage = () => {
  return (
    <Flex direction="column" gap="8" className={cn('p-8')}>
      <Flex direction="column" gap="2">
        <Text variant="heading2" color="text-basic">
          경험정리
        </Text>
        <Text variant="body1" color="text-subtler">
          경험을 정리해서 이력서 소재로 활용해요.
        </Text>
      </Flex>
      <Flex direction="row" gap="4" justify="between">
        <ExperiencesSearchField />
        <Button variant="secondary" size="md">
          프로젝트 추가하기
        </Button>
      </Flex>
      <Grid columns="4" gapX="4" gapY="6">
        {[...Array(10)].map((_, index) => (
          <ExperiencesCard key={index} />
        ))}
      </Grid>
    </Flex>
  )
}
