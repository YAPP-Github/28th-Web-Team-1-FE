import { Flex } from '@radix-ui/themes'
import { Text } from '@shared/ui'
import type { ResumeBasicInfoFieldsFragment } from '@shared/lib/gql/graphql'

/** 미리보기 상단 기본 정보 헤더. 이름과 (숨김이 아니면) 연락처를 보여준다. 편집·상세 미리보기 공통. */
export const ResumeBasicInfoHeader = ({ basicInfo }: { basicInfo: ResumeBasicInfoFieldsFragment | null }) => {
  return (
    <section className={'group-data-[active=true]:bg-primary-5/50 group-data-[active=false]:hover:bg-gray-5/50 flex w-full justify-between rounded-sm p-3 transition-colors'}>
      <Text variant={'title1'}>{basicInfo?.name}</Text>

      {/* 연락처 숨김(hideContact) 시 전화·이메일 미표시. 값 자체는 폼에 보존된다. */}
      {!basicInfo?.hideContact && (
        <Flex direction="column" gap="2">
          {basicInfo?.phone && (
            <Text size={'1'} color={'gray-40'}>
              {basicInfo.phone}
            </Text>
          )}
          {basicInfo?.email && (
            <Text size={'1'} color={'gray-40'}>
              {basicInfo.email}
            </Text>
          )}
        </Flex>
      )}
    </section>
  )
}
