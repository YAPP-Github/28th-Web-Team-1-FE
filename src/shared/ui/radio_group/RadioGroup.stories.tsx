import { RadioGroup, RadioGroupItem } from './RadioGroup'

export default {
  component: RadioGroup,
  title: 'Design System/RadioGroup',
  tags: ['autodocs']
}

export const Default = {
  render: () => (
    <RadioGroup defaultValue="option1" className="w-80">
      <RadioGroupItem value="option1">Option 1</RadioGroupItem>
      <RadioGroupItem value="option2">Option 2</RadioGroupItem>
      <RadioGroupItem value="option3">Option 3</RadioGroupItem>
    </RadioGroup>
  )
}

export const WithSelectedValue = {
  render: () => (
    <RadioGroup defaultValue="option2" className="w-80">
      <RadioGroupItem value="option1">Option 1</RadioGroupItem>
      <RadioGroupItem value="option2">Option 2</RadioGroupItem>
      <RadioGroupItem value="option3">Option 3</RadioGroupItem>
    </RadioGroup>
  )
}

export const Disabled = {
  render: () => (
    <RadioGroup defaultValue="option1" className="w-80">
      <RadioGroupItem value="option1">Option 1</RadioGroupItem>
      <RadioGroupItem value="option2" disabled>
        Option 2 (disabled)
      </RadioGroupItem>
      <RadioGroupItem value="option3">Option 3</RadioGroupItem>
    </RadioGroup>
  )
}

export const DisabledGroup = {
  render: () => (
    <RadioGroup defaultValue="option1" disabled className="w-80">
      <RadioGroupItem value="option1">Option 1</RadioGroupItem>
      <RadioGroupItem value="option2">Option 2</RadioGroupItem>
      <RadioGroupItem value="option3">Option 3</RadioGroupItem>
    </RadioGroup>
  )
}
