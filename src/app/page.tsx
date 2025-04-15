import Link from 'next/link';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { ReactElement } from 'react';

/**
 * Feature card component for the home page
 */
interface IFeatureCardProps {
  title: string;
  description: string;
  content: string;
}

const FeatureCard = ({ title, description, content }: IFeatureCardProps): ReactElement => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{content}</p>
    </CardContent>
  </Card>
);

/**
 * Hero section component
 */
const HeroSection = (): ReactElement => (
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
);

/**
 * Features section component
 */
const FeaturesSection = (): ReactElement => {
  const features: IFeatureCardProps[] = [
    {
      title: 'Quick Answers',
      description: 'Get instant responses to common recruitment questions',
      content:
        'Save time by letting AI handle repetitive questions based on your recruitment documents.',
    },
    {
      title: 'Document Management',
      description: 'Upload and manage your recruitment documents',
      content:
        'Easily upload resumes, job descriptions, and other recruitment materials to train the AI.',
    },
    {
      title: 'Cloudflare Powered',
      description: 'Fast, secure, and cost-effective',
      content: "Built on Cloudflare's infrastructure for optimal performance and security.",
    },
  ];

  return (
    <section className="container py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            content={feature.content}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Home page component
 */
const Home = (): ReactElement => (
  <MainLayout>
    <HeroSection />
    <FeaturesSection />
  </MainLayout>
);

export default Home;
