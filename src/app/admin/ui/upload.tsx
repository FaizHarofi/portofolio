import { useCallback, useEffect, useRef, useState } from "react"
import { Trash2, Upload, Copy, Check, FileImage, Film, File } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface UploadedFile {
  url: string
  pathname: string
  filename: string
}

type FilterType = "all" | "image" | "video"

function isImage(name: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(name)
}

function isVideo(name: string) {
  return /\.(mp4|webm|ogg|mov|avi)$/i.test(name)
}

function matchesFilter(name: string, filter: FilterType) {
  if (filter === "all") return true
  if (filter === "image") return isImage(name)
  if (filter === "video") return isVideo(name)
  return true
}

function fileIcon(name: string) {
  if (isImage(name)) return <FileImage className="size-4" />
  if (isVideo(name)) return <Film className="size-4" />
  return <File className="size-4" />
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  const chunkSize = 8192
  let binary = ""
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}

export function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>("all")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/uploads", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data: UploadedFile[]) => setFiles(data))
      .catch(() => {})
  }, [])

  const handleUpload = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setUploading(true)
    setError("")

    for (const file of Array.from(fileList)) {
      try {
        const base64 = await fileToBase64(file)
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            data: base64,
          }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `HTTP ${res.status}`)
        }
        const data = await res.json()
        setFiles((prev) => [...prev, { url: data.url, pathname: data.pathname, filename: file.name }])
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Upload gagal")
      }
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }, [])

  async function handleDelete(file: UploadedFile) {
    if (!confirm(`Hapus ${file.filename}?`)) return
    try {
      const res = await fetch(`/api/upload/${encodeURIComponent(file.pathname)}`, {
        method: "DELETE",
        credentials: "same-origin",
      })
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.pathname !== file.pathname))
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body.error || "Gagal hapus")
      }
    } catch {
      setError("Gagal hapus file")
    }
  }

  function copyUrl(url: string, key: string) {
    navigator.clipboard.writeText(url)
    setCopiedIdx(key)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const filtered = files.filter((f) => matchesFilter(f.filename, filter))

  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <div className="grid gap-4">
          <div>
            <h2 className="text-base font-semibold">Upload File</h2>
            <p className="text-sm text-muted-foreground">
              Upload gambar, video, atau file lainnya. URL bisa dipaste ke field project.
            </p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleUpload(e.dataTransfer.files) }}
            className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50"
          >
            <Upload className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Seret file ke sini atau{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-primary underline underline-offset-2"
              >
                pilih file
              </button>
            </p>
            <p className="text-xs text-muted-foreground/60">
              Gambar, video, PDF, dll.
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.zip"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>

          {uploading && <p className="text-sm text-muted-foreground">Mengupload…</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {files.length > 0 && (
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">File yang diupload</h3>
                <div className="flex gap-1">
                  {(["all", "image", "video"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                        filter === f
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {f === "all" ? "Semua" : f === "image" ? "Gambar" : "Video"}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada file.</p>
              ) : (
                <div className="grid gap-2">
                  {filtered.map((f) => (
                    <div
                      key={f.pathname}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      {isImage(f.filename) ? (
                        <img
                          src={f.url}
                          alt={f.filename}
                          className="size-10 shrink-0 rounded object-cover"
                        />
                      ) : (
                        <span className="flex size-10 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                          {fileIcon(f.filename)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{f.filename}</p>
                        <p className="truncate text-xs text-muted-foreground">{f.url}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => copyUrl(f.url, f.pathname)}
                        aria-label="Salin URL"
                      >
                        {copiedIdx === f.pathname ? (
                          <Check className="size-4 text-green-500" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(f)}
                        aria-label="Hapus"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
