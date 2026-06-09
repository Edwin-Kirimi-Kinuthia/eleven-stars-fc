'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Image as ImageIcon, Link as LinkIcon, Video,
  Quote, Minus,
} from 'lucide-react'
import { useCallback } from 'react'

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your post here… Tell the story of the match, share training updates, or make an announcement. Anyone can write here — just type!' }),
      Youtube.configure({ controls: true, nocookie: true }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[320px] outline-none text-gray-200 leading-relaxed prose-invert',
      },
    },
  })

  const insertImage = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file || !editor) return
      const reader = new FileReader()
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }, [editor])

  const insertYoutube = useCallback(() => {
    const url = prompt('Paste YouTube video link:')
    if (url && editor) editor.chain().focus().setYoutubeVideo({ src: url }).run()
  }, [editor])

  const setLink = useCallback(() => {
    const url = prompt('Enter URL:')
    if (url && editor) editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  const ToolBtn = ({
    onClick, active = false, title, children,
  }: {
    onClick: () => void; active?: boolean; title: string; children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105"
      style={{
        background: active ? 'rgba(233,30,140,0.2)' : 'rgba(255,255,255,0.05)',
        color: active ? '#E91E8C' : '#9CA3AF',
        border: active ? '1px solid rgba(233,30,140,0.3)' : '1px solid transparent',
      }}
    >
      {children}
    </button>
  )

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 px-4 py-3"
        style={{ background: '#141414', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={14} />
        </ToolBtn>

        <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading">
          <Heading2 size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Sub-heading">
          <Heading3 size={14} />
        </ToolBtn>

        <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
          <Quote size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Divider">
          <Minus size={14} />
        </ToolBtn>

        <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

        <ToolBtn onClick={insertImage} active={false} title="Add photo">
          <ImageIcon size={14} />
        </ToolBtn>
        <ToolBtn onClick={insertYoutube} active={false} title="Embed YouTube video">
          <Video size={14} />
        </ToolBtn>
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Add link">
          <LinkIcon size={14} />
        </ToolBtn>

        <span className="ml-auto text-gray-600 text-xs hidden sm:block">Click toolbar buttons or just start typing</span>
      </div>

      {/* Editor area */}
      <div className="px-5 py-4">
        <style>{`
          .ProseMirror p { margin: 0.75rem 0; }
          .ProseMirror h2 { color: #fff; font-size: 1.4rem; font-weight: 800; margin: 1.5rem 0 0.5rem; }
          .ProseMirror h3 { color: #E5E7EB; font-size: 1.1rem; font-weight: 700; margin: 1.25rem 0 0.4rem; }
          .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin: 0.75rem 0; color: #D1D5DB; }
          .ProseMirror li { margin: 0.3rem 0; }
          .ProseMirror blockquote { border-left: 3px solid #E91E8C; padding-left: 1rem; color: #9CA3AF; font-style: italic; margin: 1rem 0; }
          .ProseMirror hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0; }
          .ProseMirror img { max-width: 100%; border-radius: 12px; margin: 1rem 0; }
          .ProseMirror a { color: #E91E8C; text-decoration: underline; }
          .ProseMirror iframe { border-radius: 12px; width: 100%; aspect-ratio: 16/9; margin: 1rem 0; }
          .ProseMirror p.is-editor-empty:first-child::before { color: #4B5563; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
