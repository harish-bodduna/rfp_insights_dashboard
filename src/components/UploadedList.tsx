import type { DocumentBase } from '../types'

type UploadedListProps = {
  documents: DocumentBase[]
  selectedId: string | null
  onSelect: (id: string) => void
  onProcessSelected: () => Promise<void>
  isProcessing: boolean
  canProcessSelected: boolean
  onRefresh?: () => void
}

export function UploadedList({
  documents,
  selectedId,
  onSelect,
  onProcessSelected,
  isProcessing,
  canProcessSelected,
  onRefresh,
}: UploadedListProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Uploaded Files</h3>
        <div className="panel-actions">
          {onRefresh && (
            <button className="secondary" type="button" onClick={onRefresh}>
              Refresh
            </button>
          )}
          <button
            className="primary"
            disabled={!selectedId || isProcessing || !canProcessSelected}
            onClick={onProcessSelected}
          >
            {isProcessing ? 'Processing…' : 'Process'}
          </button>
        </div>
      </div>
      <ol className="document-list">
        {documents.length === 0 && (
          <p className="muted">No files waiting to be processed.</p>
        )}
        {documents.map((document, index) => {
          const isSelected = document.id === selectedId
          return (
            <li key={document.id}>
              <button
                type="button"
                className={`document-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(document.id)}
              >
                <span className="document-index">{index + 1}.</span>
                <span>
                  {document.original_filename}
                  <span className={`status-badge status-${document.status}`}>
                    {formatStatus(document.status)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function formatStatus(status: DocumentBase['status']) {
  return status
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

