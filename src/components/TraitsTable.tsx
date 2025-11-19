import type { DocumentDetail, TraitRead } from '../types'

const TRAIT_COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'due_date', label: 'Due Date' },
  { key: 'point_of_contact', label: 'Point of Contact' },
  { key: 'submitted_to', label: 'Submitted To' },
  { key: 'submission_method', label: 'Submission Method' },
  { key: 'submission_checklist', label: 'Submission Checklist' },
  { key: 'questions_poc', label: 'Questions POC' },
  { key: 'receipt_of_amendments', label: 'Receipt of Amendments' },
  { key: 'notary_needed', label: 'Notary Needed' },
  { key: 'resumes_needed', label: 'Resumes Needed' },
  { key: 'references_needed', label: 'References Needed' },
  { key: 'scope_of_work', label: 'Scope of Work' },
  { key: 'categorization', label: 'Categorization' },
  { key: 'insurance_needed', label: 'Insurance Needed' },
  { key: 'technical_requirements', label: 'Technical Requirements' },
]

type TraitsTableProps = {
  documents: DocumentDetail[]
}

export function TraitsTable({ documents }: TraitsTableProps) {
  if (documents.length === 0) {
    return null
  }

  const headers = ['S.No', 'File Name', ...TRAIT_COLUMNS.map((t) => t.label)]

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="table-title">Summary</h3>
        <button
          className="secondary"
          type="button"
          onClick={() => exportAsCsv(documents)}
          disabled={documents.length === 0}
        >
          Export CSV
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((document, rowIndex) => {
              const traitMap = new Map<string, TraitRead>()
              document.traits?.forEach((trait) => traitMap.set(trait.trait_type, trait))
              return (
                <tr key={document.id}>
                  <td>{rowIndex + 1}</td>
                  <td>{document.original_filename}</td>
                  {TRAIT_COLUMNS.map(({ key }) => (
                    <td key={`${document.id}-${key}`}>
                      <TraitCell trait={traitMap.get(key)} />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TraitCell({ trait }: { trait?: TraitRead }) {
  if (!trait) {
    return <span>—</span>
  }

  const valueText = trait.value && trait.value.trim().length > 0 ? trait.value.trim() : '—'
  const pagesText = formatPageLabel(trait.pages)
  const evidenceText = trait.evidence?.[0]?.trim()

  return (
    <div className="trait-cell">
      <div>{valueText}</div>
      {evidenceText && (
        <>
          <div className="trait-meta-label">Evidence</div>
          <div className="trait-evidence">{evidenceText}</div>
        </>
      )}
    </div>
  )
}

function formatPageLabel(pages?: number[] | null) {
  if (!pages || pages.length === 0) return ''
  const sorted = [...pages].sort((a, b) => a - b)
  const start = sorted[0]
  const end = sorted[sorted.length - 1]
  return start === end ? `Page ${start}` : `Pages ${start}-${end}`
}

function exportAsCsv(documents: DocumentDetail[]) {
  const rows = documents.map((document, rowIndex) => {
    const traitMap = new Map<string, TraitRead>()
    document.traits?.forEach((trait) => traitMap.set(trait.trait_type, trait))
    const values = TRAIT_COLUMNS.map(({ key }) => {
      const trait = traitMap.get(key)
      const value = trait?.value?.trim() || '—'
      const pages = trait ? formatPageLabel(trait.pages) : ''
      const evidence = trait?.evidence?.[0]?.trim()
      return [value, pages, evidence].filter(Boolean).join(' | ')
    })
    return [String(rowIndex + 1), document.original_filename, ...values]
  })

  const headers = ['S.No', 'File Name', ...TRAIT_COLUMNS.map((t) => t.label)]
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'rfp_traits.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

