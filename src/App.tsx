import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import './App.css'
import logo from './assets/maestro_logo.png'
import { UploadForm } from './components/UploadForm'
import { UploadedList } from './components/UploadedList'
import { ProcessedList } from './components/ProcessedList'
import { TraitsTable } from './components/TraitsTable'
import { useDocuments } from './hooks/useDocuments'
import { fetchDocumentDetail, processDocument, uploadDocument } from './api/documents'
import type { DocumentBase, DocumentDetail, DocumentStatus } from './types'

function App() {
  const queryClient = useQueryClient()
  const { data, isPending, isError, error, refetch } = useDocuments()
  const rawDocuments = data?.items ?? []

  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, DocumentStatus>>({})
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null)
  const [selectedProcessedIds, setSelectedProcessedIds] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [details, setDetails] = useState<DocumentDetail[]>([])
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const documents = useMemo(
    () =>
      rawDocuments.map((doc) =>
        optimisticStatuses[doc.id] ? { ...doc, status: optimisticStatuses[doc.id] } : doc,
      ),
    [rawDocuments, optimisticStatuses],
  )

  useEffect(() => {
    setOptimisticStatuses((prev) => {
      if (!Object.keys(prev).length) {
        return prev
      }
      let changed = false
      const next = { ...prev }
      for (const [docId] of Object.entries(prev)) {
        const latest = rawDocuments.find((doc) => doc.id === docId)
        if (!latest || latest.status !== 'uploaded') {
          delete next[docId]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [rawDocuments])

  const uploadedDocuments = useMemo(
    () => documents.filter((doc) => doc.status !== 'completed'),
    [documents],
  )
  const processedDocuments = useMemo(
    () => documents.filter((doc) => doc.status === 'completed'),
    [documents],
  )
  const selectedUploadDoc = useMemo(
    () => documents.find((doc) => doc.id === selectedUploadId) ?? null,
    [documents, selectedUploadId],
  )
  const canProcessSelected = selectedUploadDoc?.status === 'uploaded'

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    setErrorMessage(null)
    try {
      await uploadDocument(formData)
      setInfoMessage(`Uploaded ${file.name}`)
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
      setSelectedUploadId(null)
    } catch (err) {
      console.error(err)
      setErrorMessage('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleProcessSelected = async () => {
    if (!selectedUploadId) {
      setErrorMessage('Select a file from the uploaded list to process.')
      return
    }
    if (!canProcessSelected) {
      setErrorMessage('Only documents in the "uploaded" state can be processed.')
      return
    }
    setProcessing(true)
    setErrorMessage(null)
    setOptimisticStatuses((prev) => ({ ...prev, [selectedUploadId]: 'in_flight' }))
    try {
      await processDocument(selectedUploadId)
      setInfoMessage('Document queued for processing.')
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
    } catch (err) {
      console.error(err)
      setErrorMessage('Unable to start processing. Check the server logs.')
      setOptimisticStatuses((prev) => {
        const next = { ...prev }
        delete next[selectedUploadId]
        return next
      })
    } finally {
      setProcessing(false)
    }
  }

  const toggleProcessedSelection = (id: string) => {
    setSelectedProcessedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleShowDetails = async () => {
    if (selectedProcessedIds.size === 0) return
    setLoadingDetails(true)
    setErrorMessage(null)
    try {
      const documentsToFetch = Array.from(selectedProcessedIds)
      const responses = await Promise.all(documentsToFetch.map((id) => fetchDocumentDetail(id)))
      setDetails(responses)
    } catch (err) {
      console.error(err)
      setErrorMessage('Unable to load trait details.')
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleClearProcessedSelection = () => {
    setSelectedProcessedIds(new Set())
    setDetails([])
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <img src={logo} alt="Maestro logo" className="app-logo" />
        <h1>RFP Insights Dashboard</h1>
        <p className="muted">
          Upload procurement documents, run the processing pipeline, and review extracted traits.
        </p>
      </header>

      {(infoMessage || errorMessage || isError) && (
        <div className={`alert ${errorMessage || isError ? 'alert-error' : 'alert-info'}`}>
          {errorMessage || infoMessage || error?.message}
        </div>
      )}

      <UploadForm onUpload={handleUpload} isUploading={uploading} />

      <div className="panels-row">
        <UploadedList
          documents={uploadedDocuments}
          selectedId={selectedUploadId}
          onSelect={setSelectedUploadId}
          onProcessSelected={handleProcessSelected}
          isProcessing={processing}
          canProcessSelected={Boolean(canProcessSelected)}
          onRefresh={() => refetch()}
        />
        <ProcessedList
          documents={processedDocuments}
          selectedIds={selectedProcessedIds}
          onToggleSelect={toggleProcessedSelection}
          onShowDetails={handleShowDetails}
          onClearSelection={handleClearProcessedSelection}
          loadingDetails={loadingDetails}
        />
      </div>

      {isPending && <p className="muted">Loading documents…</p>}

      <TraitsTable documents={details} />
    </div>
  )
}

export default App
