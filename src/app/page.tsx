import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <MainLayout>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            RecruitReply <br className="hidden sm:inline" />
            AI-Powered Recruitment Assistant
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            A RAG system for recruitment agents to reduce time spent answering repetitive questions.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/chat" passHref>
            <Button>Get Started</Button>
          </Link>
          <Link href="/documents" passHref>
            <Button variant="outline">Manage Documents</Button>
          </Link>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Answers</CardTitle>
              <CardDescription>Get instant responses to common recruitment questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Save time by letting AI handle repetitive questions based on your recruitment documents.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Upload and manage your recruitment documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Easily upload resumes, job descriptions, and other recruitment materials to train the AI.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cloudflare Powered</CardTitle>
              <CardDescription>Fast, secure, and cost-effective</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Built on Cloudflare's infrastructure for optimal performance and security.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
