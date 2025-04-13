'use client';

import { CloudflareConfig, AppConfig } from '@/lib/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

/**
 * Component that displays the current application configuration
 * This demonstrates the values coming from Terraform via GitHub Actions
 */
export function ConfigDisplay() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex justify-between items-center">
            Application Configuration
            <Badge variant={AppConfig.isProduction ? 'default' : 'outline'}>
              {AppConfig.isProduction ? 'Production' : 'Development'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Configured via Terraform and GitHub Actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deployment Info */}
            <ConfigSection 
              title="Deployment" 
              items={[
                { label: 'Environment', value: CloudflareConfig.deployment.environment },
                { label: 'Version', value: CloudflareConfig.deployment.version },
                { label: 'Timestamp', value: CloudflareConfig.deployment.timestamp },
              ]}
            />
            
            {/* API Info */}
            <ConfigSection 
              title="API Configuration" 
              items={[
                { label: 'Endpoint', value: CloudflareConfig.api.endpoint },
                { label: 'Domain', value: CloudflareConfig.domain.url },
              ]}
            />
            
            {/* Storage Info */}
            <ConfigSection 
              title="Storage Configuration" 
              items={[
                { label: 'R2 Bucket', value: CloudflareConfig.r2.bucketName },
                { label: 'D1 Database', value: CloudflareConfig.d1.databaseName },
                { label: 'KV Namespace', value: CloudflareConfig.kv.namespaceId.substring(0, 8) + '...' },
              ]}
            />
            
            {/* Pages Info */}
            <ConfigSection 
              title="Pages Configuration" 
              items={[
                { label: 'Project Name', value: CloudflareConfig.pages.projectName },
                { label: 'Project URL', value: CloudflareConfig.pages.projectUrl },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ConfigSectionProps {
  title: string;
  items: Array<{ label: string; value: string }>;
}

function ConfigSection({ title, items }: ConfigSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
      <div className="space-y-1">
        {items.map(item => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}:</span>
            <span className="font-mono">{item.value || 'Not configured'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConfigDisplay; 