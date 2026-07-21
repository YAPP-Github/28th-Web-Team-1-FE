import { Flex, Grid } from '@radix-ui/themes'
import type { ResumeSkillFieldsFragment } from '@shared/lib/gql/graphql'
import { Text } from '@shared/ui'
import { Section } from './Section'

export const SkillSection = ({ title, items }: { title: string; items: ResumeSkillFieldsFragment[] }) => {
  return (
    <Section title={title}>
      <Grid columns={'2'} className={'w-full gap-15'}>
        {items.map((item, index) => (
          <Flex key={index} gap="2">
            <Text variant="caption1" color={'text-bolder'} className={'min-w-0 truncate'}>
              {item.name}
            </Text>
            {item.level && (
              <Text variant="caption1" color={'text-subtle'}>
                {item.level}
              </Text>
            )}
          </Flex>
        ))}
      </Grid>
    </Section>
  )
}
