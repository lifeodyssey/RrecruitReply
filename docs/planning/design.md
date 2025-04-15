# Recruitment Agent RAG System Design

## Overview

This document outlines the design for a Retrieval-Augmented Generation (RAG) system for recruitment agents. The system will allow multiple recruiters to query recruitment-related documents using natural language, with AI-generated responses based on the document content. Content management (uploading resumes and interview scripts) will be restricted to a single administrator.

## Requirements

- **User Base**: Multiple recruiters (for querying), single administrator (for content management)
- **Primary Function**: Answer common recruitment questions using uploaded documents
- **Deployment**: Cloudflare platform
- **Key Priorities**: Cost savings and quick deployment
- **Frontend**: Next.js with shadcn/ui components

## Architecture

The system follows a streamlined architecture optimized for multiple recruiters with a single administrator:

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │  Recruiter Interface │  │  Admin Interface           │   │
│  │  (Pages + shadcn/ui) │  │  (Protected Routes)         │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                API Routes (Backend)                  │    │
│  │  ┌─────────────┐  ┌───────────┐  ┌───────────────┐  │    │
│  │  │ Query API   │  │ Admin API │  │ Auth Handling │  │    │
│  │  └─────────────┘  └───────────┘  └───────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Cloudflare Services                     │
│  ┌─────────────────────────┐  ┌─────────────────────────┐   │
│  │  R2 Storage (Documents) │  │  AutoRAG Instance       │   │
│  └─────────────────────────┘  └─────────────────────────┘   │
│  ┌─────────────────────────┐  ┌─────────────────────────┐   │
│  │  D1/KV (User Sessions)  │  │  Pages (Hosting)        │   │
│  └─────────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js (React framework)
- **UI Components**: shadcn/ui (built on Radix UI and Tailwind CSS)
- **State Management**: React Context API and localStorage for conversation history
- **Hosting**: Cloudflare Pages (free tier)

### Backend
- **Framework**: Next.js API Routes
- **AI Integration**: Cloudflare AutoRAG (with built-in LLM capabilities)
- **Document Storage**: Cloudflare R2
- **User Sessions**: Cloudflare D1 or KV (lightweight storage)
- **Deployment**: Cloudflare Pages with Functions
- **External LLM**: Optional connection to OpenAI API as fallback

### Key Design Decisions

#### 1. Lightweight Database Approach
We've decided to use a lightweight database approach:
- **AutoRAG + R2 Storage** handle the core functionality (document storage and vector search)
- **Cloudflare D1/KV** for minimal user session management and authentication
- **Browser localStorage** for conversation history on individual devices
- **Cost and complexity reduction** by using serverless database options

#### 2. Cloudflare AutoRAG and LLM Integration
We're leveraging Cloudflare's AutoRAG service because:
- **Fully managed RAG pipeline** eliminates the need to build complex vector search
- **Automatic indexing** of documents uploaded to R2
- **Built-in LLM capabilities** through Cloudflare Workers AI
- **Simplified integration** with Next.js API routes
- **Cost-effective** for low to moderate usage

For LLM capabilities, we have two options:
- **Primary: Cloudflare Workers AI** - Uses Cloudflare's built-in LLM models
- **Secondary/Fallback: OpenAI API** - Optional integration for enhanced capabilities

#### 3. Modern Frontend with Next.js and shadcn/ui
We've chosen a modern frontend approach:
- **Next.js** for server-side rendering, routing, and API routes
- **shadcn/ui** for high-quality, accessible UI components
- **Tailwind CSS** for styling with component consistency
- **React Context API** for state management
- **localStorage** for conversation persistence

#### 4. Next.js API Routes for Backend
We're using Next.js API Routes because:
- **Unified codebase** for frontend and backend
- **Simplified development** with shared types and utilities
- **Serverless architecture** when deployed to Cloudflare Pages
- **Built-in routing** and middleware support
- **Tight integration** with other Cloudflare services

## Authentication System

The authentication system is designed with two distinct approaches for recruiters and administrators:

### 1. Recruiter Authentication
- **Public Access with Human Verification**:
  - Recruiter interface is publicly accessible without login requirements
  - Cloudflare Turnstile CAPTCHA integration to verify human users
  - No user accounts required for basic querying functionality
  - Prevents bot abuse while maintaining ease of access

### 2. Administrator Authentication
- **Secure Single-User Authentication**:
  - Simple but secure authentication for the single administrator
  - Email-based authentication using Next.js authentication
  - Optional two-factor authentication for enhanced security
  - Protected routes accessible only after authentication

## Implementation Components

### 1. Frontend Interface
- **Recruiter Interface**:
  - Modern chat interface with message history
  - Conversation history stored in localStorage
  - Clear history option
  - Turnstile CAPTCHA verification before first query

- **Admin Interface**:
  - Protected routes for administrators only
  - Document upload functionality
  - Content management dashboard
  - System status monitoring

### 2. Backend API (Next.js API Routes)
- **Public Endpoints**:
  - `/api/query` endpoint for processing questions
  - `/api/turnstile/verify` for verifying Turnstile CAPTCHA tokens

- **Admin-Only Endpoints**:
  - `/api/upload` endpoint for document uploads
  - `/api/manage` for content management
  - `/api/auth` for administrator authentication

- **Integration**:
  - AutoRAG for document processing and querying
  - D1/KV for session management
  - Middleware for authentication and authorization
  - Cloudflare Turnstile for human verification

### 3. Document Storage (R2)
- Storage for recruitment documents (PDFs, DOCs, etc.)
- Automatic indexing via AutoRAG

### 4. AutoRAG and LLM Integration
- **AutoRAG Instance**:
  - Vector database for document embeddings
  - Query processing and relevant document retrieval
  - Built-in response generation using Cloudflare Workers AI models

- **LLM Options**:
  - **Primary**: Cloudflare Workers AI models (included with AutoRAG)
  - **Secondary**: OpenAI API integration (optional)
  - Configuration to switch between or combine LLM providers

## Cost Optimization

The design prioritizes cost efficiency through:
1. **Leveraging free tiers** of Cloudflare services
   - Cloudflare Pages for frontend hosting
   - Workers free tier (100,000 requests/day)
   - R2 Storage free tier (10GB storage)
2. **Minimal database costs** by using Cloudflare D1/KV for lightweight storage needs
3. **Minimal compute costs** through serverless architecture
4. **Optimized document storage** by only uploading essential documents

## Deployment Strategy

### Infrastructure as Code

We'll use infrastructure as code (IaC) to manage Cloudflare resources:

- **Terraform** for provisioning and managing Cloudflare resources:
  - R2 buckets
  - D1/KV namespaces
  - Pages projects and deployments
  - AutoRAG instances
  - Custom domains and DNS settings
  - API keys and secrets management (for OpenAI if used)

- **GitHub Actions** for CI/CD pipeline:
  - Automated testing
  - Infrastructure provisioning via Terraform
  - Application deployment to Cloudflare Pages

### Deployment Steps

1. **Set up infrastructure**:
   - Use Terraform to provision all required Cloudflare resources
   - Configure AutoRAG instance connected to R2
   - Set up CI/CD pipeline with GitHub Actions
   - Configure LLM providers (Cloudflare Workers AI and optionally OpenAI)

2. **Deploy application**:
   - Deploy Next.js application to Cloudflare Pages
   - Configure environment variables and secrets

3. **Initial content loading**:
   - Upload recruitment documents to R2
   - Allow AutoRAG to index the documents

## Future Expansion Considerations

While the current design supports multiple recruiters with a single administrator, it can be expanded in the future:

1. **Enhanced user management**:
   - Role-based access control
   - Team management features
   - Advanced analytics per user

2. **Enhanced features**:
   - Document categorization and tagging
   - Analytics and usage tracking
   - Integration with other recruitment tools
   - Advanced LLM capabilities with fine-tuning

3. **Performance optimizations**:
   - Response caching for common questions
   - Advanced document preprocessing
   - Custom model fine-tuning

## Implementation Timeline

1. **Phase 1: Infrastructure Setup** (1-2 days)
   - Set up Cloudflare account and services
   - Create Terraform configuration for all resources
   - Set up GitHub repository with CI/CD workflows
   - Provision initial infrastructure
   - Configure LLM providers and API keys

2. **Phase 2: Application Development** (3-4 days)
   - Set up Next.js project with shadcn/ui
   - Implement API routes for backend functionality
   - Create recruiter chat interface with Turnstile integration
   - Implement admin dashboard and document upload
   - Add administrator authentication and protected routes

3. **Phase 3: Testing and Deployment** (1-2 days)
   - Test end-to-end functionality
   - Upload initial recruitment documents
   - Deploy to Cloudflare Pages
   - Perform user acceptance testing

## Conclusion

This design provides a cost-effective, quickly deployable RAG system for recruitment agents. By leveraging Cloudflare's infrastructure and services, particularly AutoRAG, we eliminate much of the complexity typically associated with building RAG systems while maintaining high performance and reliability.

The architecture supports multiple recruiters querying the system while restricting content management to a single administrator. The unified Next.js application for both frontend and backend ensures a cohesive development experience and simplified deployment. The use of infrastructure as code with Terraform provides reproducible deployments and easier management of Cloudflare resources.

By leveraging Cloudflare AutoRAG with its built-in LLM capabilities, we can create a complete RAG system without necessarily requiring external API connections. However, the design includes the option to integrate with OpenAI or other LLM providers for enhanced capabilities or as a fallback option, giving us flexibility while maintaining cost efficiency.
