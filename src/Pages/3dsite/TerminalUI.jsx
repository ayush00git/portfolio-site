import { useEffect, useRef, useState } from 'react'
import { useStation } from './store'

/* The machine on the screen. Boots on mount so it is already alive when the
   visitor walks up; accepts keystrokes only while the camera is docked. */

const PROMPT = 'ayush@terminal:~$'

const BOOT = [
  ['AYUSH-OS 1.0.0-stable (tty1)', 'dim'],
  [' ', ''],
  ['[    0.000000] SYSTEM BOOT — cold start initiated', 'ok'],
  ['[    0.041213] cpu0: NIT-HAMIRPUR / B.TECH CSE 2024-2028 @ 8.57 CGPA', ''],
  ['[    0.102451] mounting /dev/backend ............................ [ OK ]', ''],
  ['[    0.183009] loading runtimes: go node typescript c++ python .. [ OK ]', ''],
  ['[    0.291777] APACHE FORY SERIALIZATION CODEC .................. [ OK ]', 'hl'],
  ['[    0.291942]   ├─ ForyCodec: custom gRPC codec, protobuf replaced', 'dim'],
  ['[    0.292104]   ├─ mem.BufferSlice: zero-copy marshalling online', 'dim'],
  ['[    0.292230]   ├─ float16 (IEEE 754): go + js runtimes patched', 'dim'],
  ['[    0.292381]   └─ payload guardrails: oversized inputs rejected', 'dim'],
  ['[    0.401337] releases v0.15.0 → v1.0.0 · contributor since jan 2026', ''],
  ['[    0.500292] prod fleet: alibaba · ant group · bytedance · warner bros', ''],
  ['[    0.857000] boot complete. welcome, visitor.', 'ok'],
  [' ', ''],
  ['type `help` and press enter.', 'hint'],
]

const COMMANDS = {
  help: [
    ['about        — who is behind this machine', ''],
    ['fory         — open source work @ apache fory', ''],
    ['projects     — selected builds', ''],
    ['skills       — stack & tooling', ''],
    ['honors       — recognitions', ''],
    ['contact      — reach out', ''],
    ['clear        — wipe the screen', ''],
    ['exit         — step back from the terminal', ''],
  ],
  about: [
    ['AYUSH KUMAR', 'hl'],
    ['backend engineer in the making. B.Tech CSE @ NIT Hamirpur', ''],
    ['(2024 – 2028), CGPA 8.57/10. obsessed with serialization,', ''],
    ['distributed systems and linux internals. open source', ''],
    ['contributor at Apache Fory.', ''],
  ],
  fory: [
    ['APACHE FORY — contributor, jan 2026 → present', 'hl'],
    ['in production at alibaba, ant group, bytedance, warner bros.', 'dim'],
    ['· shipped across 4 releases, v0.15.0 → v1.0.0 (first stable)', ''],
    ['· gRPC-Go stub codegen from scratch — ForyCodec enforced as', ''],
    ['  a custom gRPC Codec over mem.BufferSlice for zero-copy', ''],
    ['  marshalling with custom type mappings', ''],
    ['· IEEE 754 float16 in go + js via raw uint16 bit manipulation', ''],
    ['  — halves memory for GPU-bound AI workloads', ''],
    ['· payload size guardrails — untrusted oversized input is', ''],
    ['  rejected before deserialization. no memory exhaustion.', ''],
  ],
  projects: [
    ['cms-web      go · gin · gorm · postgres · jwt', 'hl'],
    ['  official complaint system for NIT-H estate office. role-', ''],
    ['  based routing for XEN/JE/AE, goroutine email pipeline.', ''],
    ['laca-portal  node · redis · bullmq · mongodb', 'hl'],
    ['  official LA/CA registration. 1000+ students in 48h,', ''],
    ['  zero downtime. queue-backed SMTP, atomic seat locks.', ''],
    ['tnc          node · socket.io · react · react native', 'hl'],
    ['  realtime dev community — chat rooms, S3 media, markdown', ''],
    ['  blogs, cross-platform mobile app with push notifications.', ''],
  ],
  skills: [
    ['languages    go · c/c++ · typescript · javascript · python', ''],
    ['backend      gin · net/http · gRPC · node · express · ws', ''],
    ['data         postgres · mongodb · redis · gorm', ''],
    ['infra        aws ec2/s3 · nginx · docker · linux', ''],
    ['tooling      cobra · viper · git · postman', ''],
  ],
  honors: [
    ["dean's recognition for engineering excellence — jan 2026", 'hl'],
    ['  for the design + deployment of the LACA portal, NIT-H', ''],
    ['best beginner hack — electrothon 7.0, march 2025', 'hl'],
    ['  hardware fall-alert tool for alzheimer’s patients', ''],
  ],
  contact: [
    ['mail         ayush.2007.iit@gmail.com', ''],
    ['github       github.com/ayush00git', ''],
    ['linkedin     linkedin.com/in/ayush-kumar', ''],
    ['web          ayushz.me', ''],
  ],
  whoami: [['visitor — read access only', 'dim']],
  ls: [['about/  fory/  projects/  skills/  honors/  contact/', 'dim']],
}

export default function TerminalUI() {
  const [lines, setLines] = useState([])
  const [booted, setBooted] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef('')
  const scrollRef = useRef(null)
  const mode = useStation((s) => s.mode)

  // boot sequence, staggered like a real dmesg
  useEffect(() => {
    const timers = BOOT.map(([t, c], i) =>
      setTimeout(() => {
        setLines((l) => [...l, { t, c }])
        if (i === BOOT.length - 1) setBooted(true)
      }, 350 + i * 130)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // keystrokes only while docked
  useEffect(() => {
    if (mode !== 'focus') return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Escape') return
      if (e.key === 'Enter') {
        const raw = inputRef.current
        const cmd = raw.trim().toLowerCase()
        inputRef.current = ''
        setInput('')
        if (cmd === 'clear') return setLines([])
        if (cmd === 'exit') {
          setLines((l) => [...l, { t: `${PROMPT} ${raw}`, c: 'cmd' }, { t: 'logout', c: 'dim' }])
          return useStation.getState().setMode('intro')
        }
        const out = COMMANDS[cmd]
        setLines((l) => [
          ...l,
          { t: `${PROMPT} ${raw}`, c: 'cmd' },
          ...(cmd === ''
            ? []
            : out
              ? out.map(([t, c]) => ({ t, c }))
              : [{ t: `bash: ${cmd}: command not found`, c: 'err' }]),
        ])
      } else if (e.key === 'Backspace') {
        inputRef.current = inputRef.current.slice(0, -1)
        setInput(inputRef.current)
      } else if (e.key.length === 1 && inputRef.current.length < 48) {
        inputRef.current += e.key
        setInput(inputRef.current)
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode])

  // pin to the bottom as output grows
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, input, booted])

  return (
    <div className="crt">
      <div className="crt-head">
        <span>ayush@nith — bash — 80×24</span>
        <span>{mode === 'focus' ? 'INPUT LIVE' : 'STANDBY'}</span>
      </div>
      <div className="crt-body" ref={scrollRef}>
        {lines.map((l, i) => (
          <div key={i} className={`crt-line ${l.c}`}>
            {l.t}
          </div>
        ))}
        {booted && (
          <div className="crt-line cmd">
            {PROMPT} {input}
            <i className="crt-caret" />
          </div>
        )}
      </div>
    </div>
  )
}
