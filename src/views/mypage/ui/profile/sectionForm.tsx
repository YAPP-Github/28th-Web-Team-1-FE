'use client'
import { Flex } from '@radix-ui/themes'
import { Plus, Trash2 } from 'lucide-react'
import { Button, Divider, Spacing, Text } from '@shared/ui'
export { SelectBox } from '@shared/ui/select_box'

/** 섹션 하단 전체폭 저장 버튼. */
export const SaveButton = ({ disabled }: { disabled: boolean }) => (
  <Button type="submit" variant="primary" size="lg" fullWidth disabled={disabled}>
    저장하기
  </Button>
)

/** 반복 섹션 항목 헤더(제목 + 삭제 버튼 + 구분선). */
export const RepeatableItemHeader = ({ title, onRemove }: { title: string; onRemove: () => void }) => (
  <Flex direction="column">
    <Flex justify="between" align="center">
      <Text variant="headline2" color="text-primary-basic">
        {title}
      </Text>
      <Button type="button" variant="tertiary" size="icon-xs" onClick={onRemove} aria-label={`${title} 삭제`}>
        <Trash2 />
      </Button>
    </Flex>
    <Spacing size={12} />
    <Divider color="gray-10" />
    <Spacing size={16} />
  </Flex>
)

/** 반복 섹션 하단 "추가" 링크 버튼. */
export const AddItemButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Flex justify="center">
    <Button type="button" variant="text" size="sm" onClick={onClick}>
      {label}
      <Plus size={16} data-icon="inline-end" />
    </Button>
  </Flex>
)
