import colors from '_tosslib/constants/colors';
import { css } from '@emotion/react';

import { ReactNode } from 'react';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div
      css={css`
        max-width: 650px;
        width: 100%;
        padding: 0 4%;
        margin: 0 auto;
        height: auto;
      `}
    >
      <div
        css={css`
          background: ${colors.background};
        `}
      >
        {children}
      </div>
    </div>
  );
}
