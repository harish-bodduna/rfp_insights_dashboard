import { useQuery } from '@tanstack/react-query'
import { listDocuments } from '../api/documents'

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: listDocuments,
    refetchInterval: 30_000,
  })
}

