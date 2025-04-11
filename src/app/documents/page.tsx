"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentInfo } from "@/lib/autorag/client";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Function to fetch documents from the API
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/autorag/documents');

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle document upload
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      setIsUploading(true);
      const response = await fetch('/api/autorag/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload document');
      }

      const data = await response.json();
      toast.success(`Document uploaded successfully with ${data.chunks} chunks`);

      // Refresh the document list
      fetchDocuments();
      setIsDialogOpen(false);

      // Reset the form
      form.reset();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle document deletion
  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`/api/autorag/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete document');
      }

      toast.success('Document deleted successfully');

      // Refresh the document list
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete document');
    }
  };

  // Filter documents by type
  const getFilteredDocuments = (type: string) => {
    if (type === 'all') {
      return documents;
    }

    return documents.filter(doc => {
      const source = doc.source.toLowerCase();

      if (type === 'resumes') {
        return source.includes('resume') || source.includes('cv');
      } else if (type === 'job-descriptions') {
        return source.includes('job') || source.includes('description');
      } else {
        return !source.includes('resume') && !source.includes('cv') &&
               !source.includes('job') && !source.includes('description');
      }
    });
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Upload Document</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a document to be indexed and made searchable.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUpload}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="Document title" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="source">Source/Type</Label>
                    <Input id="source" name="source" placeholder="e.g., Resume, Job Description" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="file">File</Label>
                    <Input id="file" name="file" type="file" accept=".txt,.pdf,.docx,.md" required />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="job-descriptions">Job Descriptions</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          {['all', 'resumes', 'job-descriptions', 'other'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading documents...</p>
                </div>
              ) : getFilteredDocuments(tabValue).length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <p>No documents found. Upload some documents to get started.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getFilteredDocuments(tabValue).map((document) => (
                    <DocumentCard
                      key={document.id}
                      id={document.id}
                      title={document.title}
                      type={document.source}
                      date={new Date(document.timestamp).toLocaleDateString()}
                      chunks={document.chunks}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
}

interface DocumentCardProps {
  id: string;
  title: string;
  type: string;
  date: string;
  chunks: number;
  onDelete: (id: string) => void;
}

function DocumentCard({ id, title, type, date, chunks, onDelete }: DocumentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Uploaded on {date}</p>
        <p className="text-sm text-muted-foreground mt-1">{chunks} chunks indexed</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => window.open(`/api/autorag/documents/${id}`, '_blank')}>View</Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
