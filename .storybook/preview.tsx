import type { Preview } from '@storybook/react-vite'
// Глобальные токены (primitives + semantics + typography) и базовые стили — как в приложении
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    options: {
      storySort: {
        order: ['Foundation', ['Primitive', 'Semantic', 'Typography'], 'Components', 'Sandboxes'],
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
