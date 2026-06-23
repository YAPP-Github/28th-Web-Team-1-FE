import { Flex } from '@radix-ui/themes'
import { Heading, Text } from '@shared/ui'

export const HomePage = () => {
  return (
    <Flex direction={'column'} align={'center'} justify={'center'} className="h-screen">
      <Heading weight={'bold'} size={'8'} className="mb-4">
        Welcome to the Home Page
      </Heading>
      <Text as={'p'} size={'6'} color={'gray-10'} className="mb-8">
        This is the main landing page of our application.
      </Text>
    </Flex>
  )
}
