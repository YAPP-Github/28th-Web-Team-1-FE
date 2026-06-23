import type { Preview } from '@storybook/nextjs-vite'
import { createElement } from 'react'
import { Theme } from '@radix-ui/themes'
import '../src/app/style/globals.css'
import '@radix-ui/themes/styles.css'

const preview: Preview = {
  decorators: [(Story) => createElement(Theme, null, createElement(Story))],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  }
}

export default preview
