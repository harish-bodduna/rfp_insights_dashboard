import type { FormEvent } from 'react'
import { useRef, useState } from 'react'

type UploadFormProps = {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export function UploadForm({ onUpload, isUploading }: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setError('Please choose a PDF to upload.')
      return
    }
    setError(null)
    await onUpload(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="panel-header">
        <h2>Upload File</h2>
        <button type="submit" className="primary" disabled={isUploading}>
          {isUploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      <div className="form-group">
        <label htmlFor="file">Select PDF</label>
        <input
          type="file"
          id="file"
          ref={fileInputRef}
          accept="application/pdf"
          disabled={isUploading}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
    </form>
  )
}

