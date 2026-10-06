import { Flex, Grid } from '@radix-ui/themes'
import type { ResumeSkillFieldsFragment, SkillLevel } from '@shared/lib/gql/graphql'
import { SKILL_LEVEL_LABELS } from '@entities/profile'
import { Text } from '@shared/ui'
import { Section, SectionItemShell, type SectionItemWrapper, type PreviewItem } from './Section'

export const SkillSection = ({ title, items, ItemWrapper }: { title: string; items: Array<PreviewItem<ResumeSkillFieldsFragment>>; ItemWrapper?: SectionItemWrapper }) => {
  return (
    <Section title={title}>
      <Grid columns={'2'} className={'w-full gap-x-16 gap-y-1.5'}>
        {items.map((item, index) => (
          <SectionItemShell key={item.uid ?? index} ItemWrapper={ItemWrapper} uid={item.uid} index={index}>
            <Flex justify={'between'}>
              <Text variant="caption1" color={'text-bolder'} className={'min-w-0 truncate'}>
                {item.name}
              </Text>
              {item.level && (
                <Text variant="caption1" color={'text-subtle'}>
                  {SKILL_LEVEL_LABELS[item.level as SkillLevel] ?? item.level}
                </Text>
              )}
            </Flex>
          </SectionItemShell>
        ))}
      </Grid>
    </Section>
  )
}
