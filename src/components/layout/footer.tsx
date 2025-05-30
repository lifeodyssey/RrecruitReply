import type { ReactElement } from 'react';

export const Footer = (): ReactElement => (
  <footer className="border-t py-6 md:py-0">
    <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
        &copy; {new Date().getFullYear()} RecruitReply. All rights reserved.
      </p>
    </div>
  </footer>
);
