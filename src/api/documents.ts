import { apiClient } from './client'
import type { DocumentDetail, DocumentListResponse } from '../types'

export async function uploadDocument(formData: FormData): Promise<DocumentDetail> {
  const response = await apiClient.post<DocumentDetail>('/documents/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function listDocuments(): Promise<DocumentListResponse> {
  const response = await apiClient.get<DocumentListResponse>('/documents/', {
    params: { skip: 0, limit: 100 },
  })
  return response.data
}

export async function processDocument(documentId: string) {
  await apiClient.post(`/documents/${documentId}/process`)
}

export async function fetchDocumentDetail(documentId: string): Promise<DocumentDetail> {
  const response = await apiClient.get<DocumentDetail>(`/documents/${documentId}`)
  return response.data
}

