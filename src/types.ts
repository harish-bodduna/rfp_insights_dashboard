export type DocumentStatus = 'uploaded' | 'in_flight' | 'processing' | 'completed' | 'failed'

export interface TraitRead {
  id: string
  trait_type: string
  value?: string | null
  details?: Record<string, unknown> | null
  confidence?: number | null
  pages?: number[] | null
  evidence?: string[] | null
  created_at: string
  updated_at: string
}

export interface DocumentBase {
  id: string
  title?: string | null
  original_filename: string
  status: DocumentStatus
  page_count?: number | null
  created_at: string
  updated_at: string
}

export interface DocumentDetail extends DocumentBase {
  token_count?: number | null
  language?: string | null
  traits?: TraitRead[] | null
}

export interface DocumentListResponse {
  items: DocumentBase[]
  total: number
}

