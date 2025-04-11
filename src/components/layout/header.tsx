import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">RecruitReply</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Link href="/chat" passHref>
              <Button variant="ghost" className="mr-2">Chat</Button>
            </Link>
            <Link href="/documents" passHref>
              <Button variant="ghost">Documents</Button>
            </Link>
          </nav>
          <div className="flex items-center">
            <ModeToggle />
            <Button variant="outline" className="ml-4">
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
