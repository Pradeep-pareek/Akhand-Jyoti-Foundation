"use client"
import React, { useRef, useCallback, useEffect, useState } from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

// Toolbar button config
const TOOLBAR = [
    {
        group: 'history',
        items: [
            { cmd: 'undo', icon: '↩', title: 'Undo (Ctrl+Z)' },
            { cmd: 'redo', icon: '↪', title: 'Redo (Ctrl+Y)' },
        ]
    },
    {
        group: 'format',
        items: [
            { cmd: 'bold', icon: 'B', title: 'Bold (Ctrl+B)', style: { fontWeight: 700 } },
            { cmd: 'italic', icon: 'I', title: 'Italic (Ctrl+I)', style: { fontStyle: 'italic' } },
            { cmd: 'underline', icon: 'U', title: 'Underline (Ctrl+U)', style: { textDecoration: 'underline' } },
            { cmd: 'strikeThrough', icon: 'S̶', title: 'Strikethrough', style: { textDecoration: 'line-through' } },
        ]
    },
    {
        group: 'align',
        items: [
            { cmd: 'justifyLeft', icon: '≡L', title: 'Align Left' },
            { cmd: 'justifyCenter', icon: '≡C', title: 'Align Center' },
            { cmd: 'justifyRight', icon: '≡R', title: 'Align Right' },
        ]
    },
    {
        group: 'lists',
        items: [
            { cmd: 'insertUnorderedList', icon: '• —', title: 'Bullet List' },
            { cmd: 'insertOrderedList', icon: '1. —', title: 'Numbered List' },
        ]
    },
    {
        group: 'indent',
        items: [
            { cmd: 'indent', icon: '→|', title: 'Indent' },
            { cmd: 'outdent', icon: '|←', title: 'Outdent' },
        ]
    },
]

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']

const GREEN = '#81BA45'
const GREEN_DARK = '#5f8f2e'
const GREEN_LIGHT = '#eef6e4'
const BG = '#f4f7f0'
const BORDER = '#d4e8c4'

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Describe what this gallery item represents…',
}) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
    const [fontSize, setFontSize] = useState('14px')
    const [isFocused, setIsFocused] = useState(false)
    const isInternalUpdate = useRef(false)

    // Sync incoming value → editor (only when value changes externally)
    useEffect(() => {
        if (!editorRef.current) return
        if (isInternalUpdate.current) return
        // Convert markdown-like syntax to HTML for initial render
        const html = markdownToHtml(value)
        if (editorRef.current.innerHTML !== html) {
            editorRef.current.innerHTML = html
        }
    }, [value])

    // Track active formats for toolbar highlight
    const updateActiveFormats = useCallback(() => {
        const formats = new Set<string>()
        const checks = ['bold', 'italic', 'underline', 'strikeThrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'insertUnorderedList', 'insertOrderedList']
        checks.forEach(cmd => {
            if (document.queryCommandState(cmd)) formats.add(cmd)
        })
        setActiveFormats(formats)
    }, [])

    const handleInput = useCallback(() => {
        if (!editorRef.current) return
        isInternalUpdate.current = true
        const html = editorRef.current.innerHTML
        // Convert HTML back to markdown-like plain text for storage
        onChange(htmlToMarkdown(html))
        setTimeout(() => { isInternalUpdate.current = false }, 0)
        updateActiveFormats()
    }, [onChange, updateActiveFormats])

    const execCmd = useCallback((cmd: string, value?: string) => {
        editorRef.current?.focus()
        document.execCommand(cmd, false, value)
        updateActiveFormats()
        handleInput()
    }, [handleInput, updateActiveFormats])

    const handleFontSize = useCallback((size: string) => {
        setFontSize(size)
        editorRef.current?.focus()
        // execCommand fontSize uses 1-7, so use inline style instead
        document.execCommand('fontSize', false, '7')
        const fontElements = editorRef.current?.querySelectorAll('font[size="7"]')
        fontElements?.forEach(el => {
            (el as HTMLElement).removeAttribute('size');
            (el as HTMLElement).style.fontSize = size
        })
        handleInput()
    }, [handleInput])

    // Prevent paste of rich content / images — text only
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
        handleInput()
    }, [handleInput])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        updateActiveFormats()
    }, [updateActiveFormats])

    return (
        <div style={s.wrapper}>
            <label style={s.label}>Description</label>

            <div style={{ ...s.editorContainer, ...(isFocused ? s.editorContainerFocused : {}) }}>

                {/* ── Toolbar ── */}
                <div style={s.toolbar}>

                    {/* Font size selector */}
                    <select
                        style={s.fontSizeSelect}
                        value={fontSize}
                        onChange={e => handleFontSize(e.target.value)}
                        title="Font size"
                    >
                        {FONT_SIZES.map(sz => (
                            <option key={sz} value={sz}>{sz}</option>
                        ))}
                    </select>

                    <div style={s.separator} />

                    {TOOLBAR.map((group, gi) => (
                        <React.Fragment key={group.group}>
                            <div style={s.group}>
                                {group.items.map((item: any) => (
                                    <button
                                        key={item.cmd}
                                        type="button"
                                        title={item.title}
                                        style={{
                                            ...s.toolBtn,
                                            ...(item.style || {}),
                                            ...(activeFormats.has(item.cmd) ? s.toolBtnActive : {})
                                        }}
                                        onMouseDown={e => {
                                            e.preventDefault() // don't lose editor focus
                                            execCmd(item.cmd)
                                        }}
                                    >
                                        {item.icon}
                                    </button>
                                ))}
                            </div>
                            {gi < TOOLBAR.length - 1 && <div style={s.separator} />}
                        </React.Fragment>
                    ))}

                    {/* Extra: Horizontal rule */}
                    <div style={s.separator} />
                    <button
                        type="button"
                        title="Insert horizontal rule"
                        style={s.toolBtn}
                        onMouseDown={e => { e.preventDefault(); execCmd('insertHorizontalRule') }}
                    >—</button>

                    {/* Remove formatting */}
                    <button
                        type="button"
                        title="Clear formatting"
                        style={{ ...s.toolBtn, marginLeft: 'auto', color: '#999' }}
                        onMouseDown={e => { e.preventDefault(); execCmd('removeFormat') }}
                    >
                        Tx
                    </button>
                </div>

                {/* ── Editable area ── */}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    style={s.editor}
                    onInput={handleInput}
                    onKeyUp={handleKeyDown}
                    onMouseUp={updateActiveFormats}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onPaste={handlePaste}
                    data-placeholder={placeholder}
                />
            </div>

            <style>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #a0aec0;
          pointer-events: none;
          position: absolute;
        }
        [contenteditable]:focus { outline: none; }
        [contenteditable] ul { padding-left: 20px; margin: 4px 0; }
        [contenteditable] ol { padding-left: 20px; margin: 4px 0; }
        [contenteditable] li { margin: 2px 0; }
        [contenteditable] p  { margin: 0 0 6px; }
        [contenteditable] hr { border: none; border-top: 1px solid #d4e8c4; margin: 10px 0; }

        .tool-btn:hover {
          background: ${GREEN_LIGHT} !important;
          color: ${GREEN_DARK} !important;
        }
      `}</style>
        </div>
    )
}

// ─── Helpers: HTML ↔ markdown-like plain text ─────────────────────────────────

function htmlToMarkdown(html: string): string {
    // Use a temporary div to parse
    const div = document.createElement('div')
    div.innerHTML = html
    return nodeToText(div).trim()
}

function nodeToText(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''

    const el = node as HTMLElement
    const tag = el.tagName?.toLowerCase()
    const children = Array.from(node.childNodes).map(nodeToText).join('')

    if (tag === 'br') return '\n'
    if (tag === 'p' || tag === 'div') return children + '\n'
    if (tag === 'b' || tag === 'strong') return `**${children}**`
    if (tag === 'i' || tag === 'em') return `_${children}_`
    if (tag === 'u') return children // underline not in markdown but preserve text
    if (tag === 'li') {
        const parent = el.parentElement?.tagName?.toLowerCase()
        if (parent === 'ol') {
            const idx = Array.from(el.parentElement!.children).indexOf(el) + 1
            return `${idx}. ${children}\n`
        }
        return `- ${children}\n`
    }
    if (tag === 'ul' || tag === 'ol') return children
    if (tag === 'h1') return `# ${children}\n`
    if (tag === 'h2') return `## ${children}\n`
    if (tag === 'h3') return `### ${children}\n`
    if (tag === 'hr') return '\n---\n'
    return children
}

function markdownToHtml(text: string): string {
    if (!text) return ''
    // Minimal conversion to render in contenteditable
    const lines = text.split('\n')
    let html = ''
    let inUl = false, inOl = false

    lines.forEach(line => {
        const bullet = line.match(/^[-*•●]\s+(.+)/)
        const numbered = line.match(/^\d+\.\s+(.+)/)
        const h1 = line.match(/^#\s+(.+)/)
        const h2 = line.match(/^##\s+(.+)/)
        const hr = line.trim() === '---'

        if (!bullet && inUl) { html += '</ul>'; inUl = false }
        if (!numbered && inOl) { html += '</ol>'; inOl = false }

        if (bullet) {
            if (!inUl) { html += '<ul>'; inUl = true }
            html += `<li>${inlineMd(bullet[1])}</li>`
        } else if (numbered) {
            if (!inOl) { html += '<ol>'; inOl = true }
            html += `<li>${inlineMd(numbered[1])}</li>`
        } else if (h2) {
            html += `<h2>${inlineMd(h2[1])}</h2>`
        } else if (h1) {
            html += `<h1>${inlineMd(h1[1])}</h1>`
        } else if (hr) {
            html += '<hr/>'
        } else if (line.trim() === '') {
            html += '<br/>'
        } else {
            html += `<p>${inlineMd(line)}</p>`
        }
    })

    if (inUl) html += '</ul>'
    if (inOl) html += '</ol>'
    return html
}

function inlineMd(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    wrapper: {
        marginBottom: 24,
    },
    label: {
        display: 'block',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#6b7f6d',
        marginBottom: 8,
    },
    editorContainer: {
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        transition: 'box-shadow 0.2s, border-color 0.2s',
    },
    editorContainerFocused: {
        borderColor: GREEN,
        boxShadow: `0 0 0 3px ${GREEN}28`,
    },

    // Toolbar
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '7px 10px',
        background: BG,
        borderBottom: `1px solid ${BORDER}`,
        flexWrap: 'wrap',
        rowGap: 4,
    },
    group: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
    },
    toolBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 30,
        height: 28,
        padding: '0 6px',
        background: 'transparent',
        border: 'none',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        color: '#4a5568',
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
        lineHeight: 1,
    },
    toolBtnActive: {
        background: GREEN_LIGHT,
        color: GREEN_DARK,
        fontWeight: 700,
    },
    separator: {
        width: 1,
        height: 20,
        background: BORDER,
        margin: '0 4px',
        flexShrink: 0,
    },
    fontSizeSelect: {
        height: 28,
        padding: '0 6px',
        border: `1px solid ${BORDER}`,
        borderRadius: 6,
        background: '#fff',
        fontSize: 12,
        color: '#4a5568',
        cursor: 'pointer',
        outline: 'none',
        minWidth: 64,
    },

    // Content area
    editor: {
        minHeight: 160,
        padding: '14px 16px',
        fontSize: 14,
        color: '#2d3748',
        lineHeight: 1.7,
        outline: 'none',
        background: '#fff',
        position: 'relative',
    },
}

export default RichTextEditor