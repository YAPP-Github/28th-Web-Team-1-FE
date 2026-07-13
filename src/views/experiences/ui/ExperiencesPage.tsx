import Link from 'next/link'
import { Flex, Grid } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import { ExperiencesSearchField } from './ExperiencesSearchField'
import { AddProjectDialog } from './AddProjectDialog'

export const ExperiencesPage = () => {
  return (
    <Flex direction="column" gap="8" className="h-screen overflow-y-auto p-8">
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
        <AddProjectDialog />
      </Flex>
      <Grid columns="4" gapX="4" gapY="6">
        {[...Array(10)].map((_, index) => (
          <ExperiencesCard key={index} />
        ))}
      </Grid>
    </Flex>
  )
}

const ExperiencesCard = () => {
  return (
    <Link href="/experiences/1" className="w-full">
      <Flex direction="column" gap="3" className="group pointer-cursor">
        <div className="bg-element-primary-lighter group-hover:border-btn-secondary-border h-25 w-full rounded-lg transition-all group-hover:border" />
        <Flex direction="column" gap="1">
          <Text variant="caption1" color="text-subtler">
            2026.05 - 2026.07
          </Text>
          <Text variant="headline2" className="text-text-basic group-hover:text-text-primary-basic transition-colors">
            프로젝트명
          </Text>
        </Flex>
      </Flex>
    </Link>
  )
}
