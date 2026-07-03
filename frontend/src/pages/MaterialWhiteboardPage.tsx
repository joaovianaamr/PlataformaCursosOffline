import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Excalidraw } from '@excalidraw/excalidraw'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import type { BinaryFileData } from '@excalidraw/excalidraw/types'
import * as pdfjsLib from 'pdfjs-dist'
// eslint-disable-next-line import/no-unresolved
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { buildMaterialUrl } from '@/services/media'
import '@excalidraw/excalidraw/index.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

const PAGE_GAP = 40
const RENDER_SCALE = 1.5

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export function MaterialWhiteboardPage() {
  const [searchParams] = useSearchParams()
  const fileUrl = searchParams.get('fileUrl') ?? ''
  const title = searchParams.get('title') ?? 'Material'

  const [status, setStatus] = useState<LoadStatus>('idle')
  const [elements, setElements] = useState<ExcalidrawElement[]>([])
  const [files, setFiles] = useState<Record<string, BinaryFileData>>({})

  useEffect(() => {
    if (!fileUrl) {
      setStatus('error')
      return
    }

    let cancelled = false

    async function loadPdf() {
      setStatus('loading')
      try {
        const pdf = await pdfjsLib.getDocument({ url: buildMaterialUrl(fileUrl) }).promise
        const nextElements: ExcalidrawElement[] = []
        const nextFiles: Record<string, BinaryFileData> = {}
        let offsetY = 0

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale: RENDER_SCALE })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const context = canvas.getContext('2d')
          if (!context) continue

          await page.render({ canvas, canvasContext: context, viewport }).promise
          const dataURL = canvas.toDataURL('image/png') as BinaryFileData['dataURL']
          const fileId = `pdf-page-${pageNumber}` as BinaryFileData['id']

          nextFiles[fileId] = {
            mimeType: 'image/png',
            id: fileId,
            dataURL,
            created: Date.now(),
            lastRetrieved: Date.now(),
          }

          nextElements.push({
            id: `pdf-page-el-${pageNumber}`,
            type: 'image',
            x: 0,
            y: offsetY,
            width: viewport.width,
            height: viewport.height,
            angle: 0,
            strokeColor: 'transparent',
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            groupIds: [],
            frameId: null,
            roundness: null,
            seed: pageNumber,
            version: 1,
            versionNonce: pageNumber,
            isDeleted: false,
            boundElements: null,
            updated: Date.now(),
            link: null,
            locked: true,
            fileId,
            scale: [1, 1],
            status: 'saved',
            index: null,
          } as unknown as ExcalidrawElement)

          offsetY += viewport.height + PAGE_GAP
        }

        if (!cancelled) {
          setElements(nextElements)
          setFiles(nextFiles)
          setStatus('ready')
        }
      } catch (error) {
        console.error('Falha ao carregar PDF no quadro', error)
        if (!cancelled) setStatus('error')
      }
    }

    loadPdf()
    return () => {
      cancelled = true
    }
  }, [fileUrl])

  return (
    <div className="flex h-screen flex-col bg-bg">
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-text hover:underline">
            &larr; Voltar
          </Link>
          <h1 className="font-semibold text-text">{title}</h1>
        </div>
        {status === 'loading' && <span className="text-sm text-text">Carregando PDF...</span>}
        {status === 'error' && (
          <span className="text-sm text-red-500">Não foi possível carregar o PDF.</span>
        )}
      </header>
      <div className="flex-1">
        {status === 'ready' && (
          <Excalidraw
            key={fileUrl}
            initialData={{
              elements,
              files,
              appState: { viewBackgroundColor: '#ffffff' },
            }}
          />
        )}
      </div>
    </div>
  )
}
