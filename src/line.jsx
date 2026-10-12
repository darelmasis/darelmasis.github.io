import { COMMANDS } from './commands.js'
import { highlight, highlightShell } from './highlight.js'
import { promptUser } from './profile.js'

export function Tokens({ tokens }) {
  return tokens.map((token, index) => (
    <span className={`tok-${token.kind}`} key={index}>
      {token.text}
    </span>
  ))
}

export function Prompt() {
  return (
    <span aria-hidden="true" className="agnoster">
      <span className="agnoster-seg agnoster-user">
        {promptUser}
        <span className="agnoster-chevron" />
      </span>
      <span className="agnoster-seg agnoster-path">
        ~
        <span className="agnoster-chevron" />
      </span>
    </span>
  )
}

function CodeLines({ file, lines }) {
  const width = String(lines.length).length

  return (
    <div className="py-1">
      {file ? <div className="tok-comment">{`# ${file}`}</div> : null}
      <pre className="overflow-x-auto">
        {lines.map((codeLine, index) => (
          <div className="flex min-w-0" key={index}>
            <span className="tok-comment w-7 shrink-0 select-none pr-3 text-right">
              {String(index + 1).padStart(width, ' ')}
            </span>
            <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
              {codeLine ? <Tokens tokens={highlight(codeLine)} /> : '\n'}
            </span>
          </div>
        ))}
      </pre>
    </div>
  )
}

export function Line({ line }) {
  if (line.kind === 'blank') return <div aria-hidden="true" className="h-3" />

  if (line.kind === 'command') {
    return (
      <div className="flex flex-wrap items-center">
        <Prompt />
        <span className="min-w-0 [overflow-wrap:anywhere]">
          <Tokens tokens={highlightShell(line.text, COMMANDS)} />
        </span>
      </div>
    )
  }

  if (line.kind === 'accent') {
    return <div className="tok-accent">{line.text}</div>
  }

  if (line.kind === 'muted') {
    return <div className="tok-comment">{line.text}</div>
  }

  if (line.kind === 'row') {
    return (
      <div className="flex gap-x-4">
        <span className="tok-attr w-[8.5rem] shrink-0">{line.label}</span>
        <span className="tok-plain min-w-0 flex-1">{line.value}</span>
      </div>
    )
  }

  if (line.kind === 'link') {
    return (
      <a
        className="group flex gap-x-4 rounded-xs"
        href={line.value}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="tok-attr w-[8.5rem] shrink-0 group-hover:underline">{line.label}</span>
        <span className="tok-string min-w-0 flex-1 underline-offset-4 group-hover:underline">
          {line.value.replace(/^https?:\/\//, '')}
        </span>
      </a>
    )
  }

  if (line.kind === 'block') {
    return <pre className="tok-plain overflow-x-auto py-1">{line.lines.join('\n')}</pre>
  }

  if (line.kind === 'code') {
    return <CodeLines file={line.file} lines={line.lines} />
  }

  return <div className="tok-plain">{line.text}</div>
}
