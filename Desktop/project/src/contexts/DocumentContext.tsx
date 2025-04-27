import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format, addDays, isBefore } from 'date-fns';

export interface Document {
  id: string;
  userId: string;
  title: string;
  type: 'certificate' | 'policy' | 'claim';
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  uploadDate: Date;
  expiryDate?: Date;
  reviewedBy?: string;
  reviewDate?: Date;
  notes?: string;
  certificateId?: string;
  qrCode?: string;
  watermark?: string;
}

interface DocumentContextType {
  documents: Document[];
  addDocument: (doc: Partial<Document>) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  getDocumentById: (id: string) => Document | undefined;
  getExpiringDocuments: () => Document[];
  generateCertificate: (docId: string) => Promise<string>;
  generateQRCode: (docId: string) => Promise<string>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('detachd_documents');
    return saved ? JSON.parse(saved) : [];
  });

  const addDocument = async (doc: Partial<Document>): Promise<Document> => {
    const newDoc: Document = {
      id: Math.random().toString(36).substring(2, 9),
      userId: doc.userId || '',
      title: doc.title || '',
      type: doc.type || 'certificate',
      status: 'pending',
      uploadDate: new Date(),
      watermark: `Detachd-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
      ...doc,
    };

    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    localStorage.setItem('detachd_documents', JSON.stringify(updatedDocs));
    return newDoc;
  };

  const updateDocument = async (id: string, updates: Partial<Document>): Promise<void> => {
    const updatedDocs = documents.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    );
    setDocuments(updatedDocs);
    localStorage.setItem('detachd_documents', JSON.stringify(updatedDocs));
  };

  const getDocumentById = (id: string): Document | undefined => {
    return documents.find(doc => doc.id === id);
  };

  const getExpiringDocuments = (): Document[] => {
    const thirtyDaysFromNow = addDays(new Date(), 30);
    return documents.filter(doc => 
      doc.expiryDate && 
      isBefore(new Date(doc.expiryDate), thirtyDaysFromNow)
    );
  };

  const generateCertificate = async (docId: string): Promise<string> => {
    const doc = getDocumentById(docId);
    if (!doc) throw new Error('Document not found');
    
    const certificateId = `CERT-${Math.random().toString(36).substring(2, 9)}`;
    await updateDocument(docId, { certificateId });
    return certificateId;
  };

  const generateQRCode = async (docId: string): Promise<string> => {
    const doc = getDocumentById(docId);
    if (!doc) throw new Error('Document not found');
    
    const qrData = {
      id: doc.id,
      certificateId: doc.certificateId,
      timestamp: new Date().toISOString(),
    };
    
    return JSON.stringify(qrData);
  };

  const value = {
    documents,
    addDocument,
    updateDocument,
    getDocumentById,
    getExpiringDocuments,
    generateCertificate,
    generateQRCode,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};