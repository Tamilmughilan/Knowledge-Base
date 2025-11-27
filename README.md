Knowledge Base
================================

Project Overview
-------------------

### Introduction

The Knowledge Base Management System is a full-stack web application designed for enterprise document management and knowledge sharing. It provides a centralized platform where organizations can store, organize, search, and maintain corporate documents such as policies, procedures, guidelines, and reference materials.
![Knowledge Base Screenshot](https://github.com/user-attachments/assets/a57111da-770a-4105-8c67-fe9db83aa740)


### Problem Statement

Organizations struggle with:

*   **Document Accessibility**: Employees cannot quickly locate specific policies or procedures
    
*   **Version Control**: Difficulty tracking document changes and maintaining audit trails
    
*   **Access Management**: Lack of role-based permissions for sensitive documents
    
*   **Search Efficiency**: Ineffective search capabilities across large document repositories
    
*   **Knowledge Silos**: Information scattered across email, shared drives, and individual systems
    

### Solution

This application solves these challenges by providing:

*   **Centralized Repository**: Single source of truth for all organizational documents
    
*   **Automated Version Control**: Complete history tracking with snapshot preservation
    
*   **Role-Based Access**: Three-tier permission system (Employee, Contributor, Admin)
    
*   **Intelligent Search**: Multi-field search across titles, content, categories, and tags
    
*   **Hybrid Storage**: MongoDB for metadata, filesystem for efficient file storage
    
*   **Audit Trail**: Complete tracking of who created/modified what and when
    

Features
--------------

###  Authentication & Authorization

*   User registration and login system
    
*   Role-based access control (RBAC)
    
*   Session persistence with localStorage
    
*   Three user roles: Employee (view), Contributor (edit), Admin (full access)
    

###  Document Management

*   Create text documents or upload files (PDF, DOC, DOCX, TXT)
    
*   Edit existing documents with automatic versioning
    
*   Delete documents with cascade cleanup
    
*   Categorize documents for organization
    
*   Tag documents with keywords for discoverability
    
*   View document metadata (author, dates, version)
    

###  Advanced Search

*   Multi-field keyword search (title, content, category, tags)
    
*   Category-based filtering
    
*   Tag-based filtering
    
*   Combined search parameters
    
*   Case-insensitive regex matching
    

###  Version Control

*   Automatic snapshot creation before updates
    
*   Complete version history with timestamps
    
*   File versioning with physical copies
    
*   View and download historical versions
    
*   Track who made changes and when
    

###  File Operations

*   Upload files with validation (type, size, security)
    
*   Download files with proper headers
    
*   In-browser PDF viewing
    
*   Version file downloads
    
*   Secure file access with path traversal prevention
    

###  User Management (Admin Only)

*   View all registered users
    
*   Modify user roles dynamically
    
*   Delete user accounts (except default admin)
    
*   Role assignment and permission management

### Technology Stack

### Frontend

*   React 18.2.0 – Component-based UI library

*   Axios 1.4.0 – HTTP client for API requests

*   CSS3 – Custom styling with Flexbox

*   JavaScript ES6+ – Modern JavaScript features

### Backend

*   Java 17

*   Spring Boot 3.1.0

*   Spring Data MongoDB

*   Spring Web

*   Maven 3.8+

### Database and Storage

*   MongoDB 6.0

*   File System (uploads/)

### Development Tools

*   npm

*   Git

*   Postman

*   Eclipse

*   Prerequisites

### Required Software

*   Java Development Kit (JDK) 17 or higher

*   Node.js 16+ and npm

*   MongoDB 6.0 or higher

### Installation and Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/knowledge-base.git

cd knowledge-base
```
### Step 2: Start MongoDB

*   Start MongoDB either as a background service or by running mongod manually

Verify using mongosh

### Step 3: Backend Setup

Navigate to backend folder
```bash
cd backend
```
*   Update MongoDB credentials in src/main/resources/application.properties

*   spring.data.mongodb.uri=mongodb://localhost:27017/knowledgebase

*   spring.data.mongodb.database=knowledgebase

*   server.port=8080

*   spring.servlet.multipart.max-file-size=50MB

*   spring.servlet.multipart.max-request-size=50MB

### Build project using Maven
```bash
mvn clean install
```
### Run backend
```bash
mvn spring-boot:run
```
### Step 4: Create upload folders

*   uploads/

*   uploads/versions/

### Step 5: Frontend Setup

Navigate to frontend
```bash
cd frontend
```
Install dependencies
```bash
npm install
```
### Run frontend
```bash
npm start
```
*   Application opens at http://localhost:3000

