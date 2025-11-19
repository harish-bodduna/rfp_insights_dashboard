import type { DocumentBase } from '../types'

type ProcessedListProps = {
  documents: DocumentBase[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onShowDetails: () => Promise<void>
  onClearSelection: () => void
  loadingDetails: boolean
}

export function ProcessedList({
  documents,
  selectedIds,
  onToggleSelect,
  onShowDetails,
  onClearSelection,
  loadingDetails,
}: ProcessedListProps) {
  const hasSelection = selectedIds.size > 0
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Processed Files</h3>
        <div className="panel-actions">
          <button
            className="secondary"
            type="button"
            disabled={!hasSelection}
            onClick={onClearSelection}
          >
            Clear
          </button>
          <button
            className="primary"
            type="button"
            disabled={!hasSelection || loadingDetails}
            onClick={onShowDetails}
          >
            {loadingDetails ? 'Loading…' : 'Show Details'}
          </button>
        </div>
      </div>
      <ol className="document-list">
        {documents.length === 0 && (
          <p className="muted">No files have been processed yet.</p>
        )}
        {documents.map((document, index) => {
          const isSelected = selectedIds.has(document.id)
          return (
            <li key={document.id}>
              <label className={`document-item ${isSelected ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(document.id)}
                />
                <span className="document-index">{index + 1}.</span>
                <span>{document.original_filename}</span>
              </label>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

