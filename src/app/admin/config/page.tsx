import { Metadata } from 'next';
import ConfigDisplay from '@/components/ConfigDisplay';
import { AppConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Infrastructure Configuration - ' + AppConfig.name,
  description: 'Admin panel for viewing infrastructure configuration from Terraform',
};

export default function ConfigPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Infrastructure Configuration</h1>
        <p className="text-muted-foreground">
          This page displays configuration values automatically injected from Terraform
          via GitHub Actions. These values are updated whenever infrastructure changes
          are deployed.
        </p>
      </div>
      
      <ConfigDisplay />

      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> These values are automatically configured via the 
          GitHub Actions workflow that retrieves Terraform outputs. No manual configuration
          is required between infrastructure and application deployments.
        </p>
      </div>
    </div>
  );
} 