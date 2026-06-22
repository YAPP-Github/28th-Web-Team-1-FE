import { Flex, Heading, Text } from '@radix-ui/themes'

export const HomePage = () => {
  return (
    <Flex direction={'column'} align={'center'} justify={'center'} className="h-screen">
      <Heading weight={'bold'} size={'8'} className="mb-4">
        Welcome to the Home Page
      </Heading>
      <Text as={'p'} size={'6'} color={'gray'} className="mb-8">
        This is the main landing page of our application.
      </Text>
    </Flex>
  )
}
