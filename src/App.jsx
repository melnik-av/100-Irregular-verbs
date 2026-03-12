import { useState, useRef, useEffect, useCallback } from 'react'
import { VERBS, GROUP_INFO } from './data/verbs'

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)
const normalize = s => s.trim().toLowerCase().replace(/\s+/g, ' ')

// ─── STYLES ────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: '100dvh',
    background: '#0F0F14',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
  },
  phone: {
    width: '100%',
    maxWidth: 430,
    minHeight: '100dvh',
    background: '#0F0F14',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  topRainbow: {
    height: 3,
    background: 'linear-gradient(90deg,#E91E63,#FF9800,#4CAF50,#2196F3)',
    flexShrink: 0,
  },
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────

function ProgressBar({ value, color = '#E91E63' }) {
  return (
    <div style={{ flex: 1, height: 3, background: '#1e1e2e', borderRadius: 2 }}>
      <div style={{
        height: '100%', width: `${value}%`, background: color,
        borderRadius: 2, transition: 'width .3s ease',
      }} />
    </div>
  )
}

function TopBar({ onBack, progress, current, total, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px' }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: '#666', fontSize: 22,
        cursor: 'pointer', padding: 4, lineHeight: 1,
      }}>←</button>
      <ProgressBar value={progress} color={color} />
      <span style={{ fontSize: 12, color: '#444', whiteSpace: 'nowrap' }}>{current}/{total}</span>
    </div>
  )
}

function ScoreRow({ good, bad }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
      <span style={{ fontSize: 13, color: '#4CAF50' }}>✓ {good}</span>
      <span style={{ fontSize: 13, color: '#333' }}>·</span>
      <span style={{ fontSize: 13, color: '#E91E63' }}>✗ {bad}</span>
    </div>
  )
}

function DoneScreen({ score, total, wrong, wrongMode, onMenu, onAgain }) {
  const pct = Math.round((score / total) * 100)
  const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, overflowY: 'auto' }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
      <div style={{ fontSize: 52, fontWeight: 800, color: '#F5F5F0', fontFamily: 'Barlow Condensed, sans-serif' }}>{score}/{total}</div>
      <div style={{ fontSize: 15, color: '#666', marginBottom: 32 }}>{pct}% {wrongMode ? 'без ошибок' : 'правильно'}</div>

      {wrong.length > 0 && (
        <div style={{ width: '100%', marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#E91E63', marginBottom: 10 }}>ОШИБКИ</div>
          {wrong.map((v, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#16161E', borderRadius: 10, padding: '10px 14px', marginBottom: 6,
            }}>
              <span style={{ color: '#ccc', fontSize: 15, fontWeight: 600 }}>{v.v1}</span>
              <span style={{ color: '#555', fontSize: 12 }}>{v.v2} · {v.v3}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, width: '100%' }}>
        <button onClick={onMenu} style={{
          flex: 1, padding: 16, borderRadius: 14, border: '1.5px solid #2e2e45',
          background: '#16161E', color: '#666', fontSize: 15, cursor: 'pointer',
        }}>← Меню</button>
        <button onClick={onAgain} style={{
          flex: 1, padding: 16, borderRadius: 14, border: 'none',
          background: '#E91E63', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
        }}>Ещё раз</button>
      </div>
    </div>
  )
}

// ─── HOME ──────────────────────────────────────────────────────────────────
function HomeScreen({ onStart }) {
  const [group, setGroup] = useState(0)
  const counts = [1, 2, 3, 4].map(g => VERBS.filter(v => v.group === g).length)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 48px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: '#555', marginBottom: 8 }}>ENGLISH GRAMMAR</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#F5F5F0', lineHeight: 1.2, fontFamily: 'Barlow Condensed, sans-serif' }}>
          Неправильные<br />глаголы
        </div>
        <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>100 глаголов · 4 группы</div>
      </div>

      {/* Group filter */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', marginBottom: 12 }}>ГРУППА</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4].map(g => {
            const active = group === g
            const color = g === 0 ? '#888' : GROUP_INFO[g].color
            return (
              <button key={g} onClick={() => setGroup(g)} style={{
                padding: '6px 14px', borderRadius: 20,
                border: `1.5px solid ${active ? color : '#2a2a35'}`,
                background: active ? color + '22' : 'transparent',
                color: active ? color : '#555',
                fontSize: 12, cursor: 'pointer',
                transition: 'all .15s',
              }}>
                {g === 0 ? 'Все' : `Группа ${g}`}
              </button>
            )
          })}
        </div>
        {group > 0 && (
          <div style={{ marginTop: 8, fontSize: 12, color: GROUP_INFO[group].color }}>
            {GROUP_INFO[group].label} — {GROUP_INFO[group].desc} · {counts[group - 1]} гл.
          </div>
        )}
      </div>

      {/* Mode buttons */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', marginBottom: 12 }}>РЕЖИМ</div>
        {[
          { mode: 'flashcard', emoji: '🃏', title: 'Карточки', desc: 'Переворачивайте карточки, запоминайте формы' },
          { mode: 'quiz',      emoji: '⚡', title: 'Тест',     desc: 'Выберите правильную форму из 4 вариантов' },
          { mode: 'typein',    emoji: '✏️', title: 'Письмо',   desc: 'Введите все три формы глагола вручную' },
        ].map(({ mode, emoji, title, desc }) => (
          <button key={mode} onClick={() => onStart(mode, group)} style={{
            display: 'flex', alignItems: 'center', gap: 14, width: '100%',
            background: '#16161E', border: '1px solid #1e1e2e', borderRadius: 16,
            padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
            marginBottom: 10, transition: 'transform .1s',
          }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(.98)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: 26 }}>{emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F0', marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.4 }}>{desc}</div>
            </div>
            <span style={{ fontSize: 22, color: '#333' }}>›</span>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div>
        <div style={{ fontSize: 10, letterSpacing: 3, color: '#444', marginBottom: 12 }}>ГРУППЫ</div>
        {[1, 2, 3, 4].map(g => (
          <div key={g} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: GROUP_INFO[g].color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#666' }}>
              <span style={{ color: GROUP_INFO[g].color, fontWeight: 700 }}>{GROUP_INFO[g].label}</span>
              {' — '}{GROUP_INFO[g].desc}{' '}
              <span style={{ color: '#444' }}>({counts[g - 1]})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── FLASHCARD ─────────────────────────────────────────────────────────────
function FlashcardScreen({ filterGroup, onBack, onRestart }) {
  const pool = filterGroup === 0 ? VERBS : VERBS.filter(v => v.group === filterGroup)
  const [deck] = useState(() => shuffle(pool))
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState([])
  const [unknown, setUnknown] = useState([])
  const [done, setDone] = useState(false)

  const verb = deck[idx]
  const color = verb ? GROUP_INFO[verb.group].color : '#888'
  const progress = (idx / deck.length) * 100

  const next = (isKnown) => {
    if (isKnown) setKnown(k => [...k, deck[idx]])
    else setUnknown(k => [...k, deck[idx]])
    if (idx + 1 >= deck.length) { setDone(true); return }
    setIdx(i => i + 1)
    setFlipped(false)
  }

  if (done) return (
    <DoneScreen score={known.length} total={deck.length} wrong={unknown}
      wrongMode onMenu={onBack} onAgain={onRestart} />
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} progress={progress} current={idx + 1} total={deck.length} color="#E91E63" />
      <ScoreRow good={known.length} bad={unknown.length} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 24px' }}>
        {/* Card */}
        <div onClick={() => setFlipped(f => !f)} style={{
          width: '100%', minHeight: 240,
          background: '#16161E', borderRadius: 24, border: `1.5px solid ${color}44`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 32, cursor: 'pointer', userSelect: 'none',
          boxShadow: `0 0 40px ${color}0d`,
          transition: 'background .2s',
        }}>
          {!flipped ? (
            <>
              <div style={{ fontSize: 10, letterSpacing: 3, color, marginBottom: 20 }}>ИНФИНИТИВ</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: '#F5F5F0', fontFamily: 'Barlow Condensed, sans-serif', marginBottom: 10 }}>{verb.v1}</div>
              <div style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>{verb.ru}</div>
              <div style={{
                background: color + '18', border: `1px solid ${color}33`,
                borderRadius: 12, padding: '5px 12px', marginBottom: 16,
              }}>
                <span style={{ fontSize: 11, color }}>{GROUP_INFO[verb.group].label}</span>
              </div>
              <div style={{ fontSize: 11, color: '#333' }}>нажмите, чтобы перевернуть</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 10, letterSpacing: 3, color, marginBottom: 24 }}>ВСЕ ФОРМЫ</div>
              <div style={{ display: 'flex', gap: 0, alignItems: 'center', marginBottom: 20 }}>
                {[
                  { label: 'V1', val: verb.v1, col: '#F5F5F0' },
                  { label: 'V2', val: verb.v2, col: '#E91E63' },
                  { label: 'V3', val: verb.v3, col: '#4CAF50' },
                ].map(({ label, val, col }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    {i > 0 && <div style={{ width: 1, height: 50, background: '#1e1e2e', margin: '0 20px' }} />}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, letterSpacing: 2, color: col === '#F5F5F0' ? '#555' : col, marginBottom: 8 }}>{label}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: col, fontFamily: 'Barlow Condensed, sans-serif' }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 15, color: '#666' }}>{verb.ru}</div>
            </>
          )}
        </div>

        {flipped && (
          <div style={{ display: 'flex', gap: 12, marginTop: 24, width: '100%' }}>
            <button onClick={() => next(false)} style={{
              flex: 1, padding: 16, borderRadius: 14,
              border: '1.5px solid #E91E63', background: '#E91E6311',
              color: '#E91E63', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>✗ Не знаю</button>
            <button onClick={() => next(true)} style={{
              flex: 1, padding: 16, borderRadius: 14,
              border: '1.5px solid #4CAF50', background: '#4CAF5011',
              color: '#4CAF50', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>✓ Знаю</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── QUIZ ──────────────────────────────────────────────────────────────────
function buildQ(verb) {
  const field = Math.random() > .5 ? 'v2' : 'v3'
  const label = field === 'v2' ? 'Past Simple' : 'Past Participle'
  const correct = verb[field]
  const pool = VERBS.filter(v => v[field] !== correct)
  const opts = shuffle([correct, ...shuffle(pool).slice(0, 3).map(v => v[field])])
  return { field, label, correct, opts }
}

function QuizScreen({ filterGroup, onBack, onRestart }) {
  const pool = filterGroup === 0 ? VERBS : VERBS.filter(v => v.group === filterGroup)
  const [deck] = useState(() => shuffle(pool))
  const [idx, setIdx] = useState(0)
  const [q, setQ] = useState(() => buildQ(deck[0]))
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState([])
  const [done, setDone] = useState(false)

  const handle = (opt) => {
    if (selected) return
    setSelected(opt)
    if (opt === q.correct) setScore(s => s + 1)
    else setWrong(w => [...w, deck[idx]])
    setTimeout(() => {
      const ni = idx + 1
      if (ni >= deck.length) { setDone(true); return }
      setIdx(ni); setQ(buildQ(deck[ni])); setSelected(null)
    }, 800)
  }

  if (done) return (
    <DoneScreen score={score} total={deck.length} wrong={wrong}
      onMenu={onBack} onAgain={onRestart} />
  )

  const verb = deck[idx]
  const color = GROUP_INFO[verb.group].color
  const progress = (idx / deck.length) * 100

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} progress={progress} current={idx + 1} total={deck.length} color="#2196F3" />

      <div style={{ flex: 1, padding: '8px 24px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color, marginBottom: 10 }}>{q.label} от:</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: '#F5F5F0', fontFamily: 'Barlow Condensed, sans-serif', marginBottom: 6 }}>{verb.v1}</div>
          <div style={{ fontSize: 16, color: '#555' }}>{verb.ru}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((opt, i) => {
            let bg = '#16161E', border = '#2e2e45', col = '#ccc'
            if (selected) {
              if (opt === q.correct) { bg = '#4CAF5015'; border = '#4CAF50'; col = '#4CAF50' }
              else if (opt === selected) { bg = '#E91E6315'; border = '#E91E63'; col = '#E91E63' }
            }
            return (
              <button key={i} onClick={() => handle(opt)} style={{
                padding: '16px 18px', borderRadius: 14, border: `1.5px solid ${border}`,
                background: bg, color: col, fontSize: 20, fontWeight: 600,
                cursor: selected ? 'default' : 'pointer', textAlign: 'left',
                fontFamily: 'Barlow Condensed, sans-serif', transition: 'all .15s',
              }}>{opt}</button>
            )
          })}
        </div>

        <ScoreRow good={score} bad={wrong.length} />
      </div>
    </div>
  )
}

// ─── TYPEIN ────────────────────────────────────────────────────────────────
function TypeInScreen({ filterGroup, onBack, onRestart }) {
  const pool = filterGroup === 0 ? VERBS : VERBS.filter(v => v.group === filterGroup)
  const [deck] = useState(() => shuffle(pool))
  const [idx, setIdx] = useState(0)
  const [v2, setV2] = useState('')
  const [v3, setV3] = useState('')
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState([])
  const [done, setDone] = useState(false)
  const v3Ref = useRef(null)

  const verb = deck[idx]
  const color = GROUP_INFO[verb.group].color
  const progress = (idx / deck.length) * 100

  const check = () => {
    if (!v2.trim() || !v3.trim()) return
    setChecked(true)
    const ok = normalize(v2) === normalize(verb.v2) && normalize(v3) === normalize(verb.v3)
    if (ok) setScore(s => s + 1)
    else setWrong(w => [...w, verb])
  }

  const next = () => {
    const ni = idx + 1
    if (ni >= deck.length) { setDone(true); return }
    setIdx(ni); setV2(''); setV3(''); setChecked(false)
  }

  if (done) return (
    <DoneScreen score={score} total={deck.length} wrong={wrong}
      wrongMode onMenu={onBack} onAgain={onRestart} />
  )

  const v2ok = checked && normalize(v2) === normalize(verb.v2)
  const v3ok = checked && normalize(v3) === normalize(verb.v3)
  const v2err = checked && !v2ok
  const v3err = checked && !v3ok

  const inputStyle = (ok, err) => ({
    background: ok ? '#4CAF5010' : err ? '#E91E6310' : '#16161E',
    border: `1.5px solid ${ok ? '#4CAF50' : err ? '#E91E63' : '#2e2e45'}`,
    borderRadius: 12, padding: '14px 16px', fontSize: 20, fontWeight: 600,
    color: '#F5F5F0', width: '100%', outline: 'none', fontFamily: 'Barlow Condensed, sans-serif',
    caretColor: color,
  })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} progress={progress} current={idx + 1} total={deck.length} color="#FF9800" />

      <div style={{ flex: 1, padding: '8px 24px 32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color, marginBottom: 10 }}>НАПИШИТЕ ФОРМЫ</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: '#F5F5F0', fontFamily: 'Barlow Condensed, sans-serif', marginBottom: 6 }}>{verb.v1}</div>
          <div style={{ fontSize: 16, color: '#555' }}>{verb.ru}</div>
        </div>

        {/* V2 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: v2ok ? '#4CAF50' : v2err ? '#E91E63' : '#555', marginBottom: 8 }}>Past Simple (V2)</div>
          <input
            style={inputStyle(v2ok, v2err)}
            value={v2} onChange={e => setV2(e.target.value)}
            placeholder="введите Past Simple..."
            disabled={checked}
            onKeyDown={e => e.key === 'Enter' && v3Ref.current?.focus()}
            autoCapitalize="none" autoCorrect="off" spellCheck="false"
          />
          {v2err && <div style={{ color: '#4CAF50', fontSize: 13, marginTop: 6 }}>✓ {verb.v2}</div>}
        </div>

        {/* V3 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: v3ok ? '#4CAF50' : v3err ? '#E91E63' : '#555', marginBottom: 8 }}>Past Participle (V3)</div>
          <input
            ref={v3Ref}
            style={inputStyle(v3ok, v3err)}
            value={v3} onChange={e => setV3(e.target.value)}
            placeholder="введите Past Participle..."
            disabled={checked}
            onKeyDown={e => e.key === 'Enter' && check()}
            autoCapitalize="none" autoCorrect="off" spellCheck="false"
          />
          {v3err && <div style={{ color: '#4CAF50', fontSize: 13, marginTop: 6 }}>✓ {verb.v3}</div>}
        </div>

        <ScoreRow good={score} bad={wrong.length} />

        {!checked ? (
          <button onClick={check} disabled={!v2.trim() || !v3.trim()} style={{
            width: '100%', padding: 17, borderRadius: 14, border: 'none',
            background: (!v2.trim() || !v3.trim()) ? '#1e1e2e' : '#FF9800',
            color: (!v2.trim() || !v3.trim()) ? '#444' : '#fff',
            fontSize: 16, fontWeight: 700, cursor: (!v2.trim() || !v3.trim()) ? 'default' : 'pointer',
          }}>Проверить</button>
        ) : (
          <button onClick={next} style={{
            width: '100%', padding: 17, borderRadius: 14,
            border: '1.5px solid #FF9800', background: 'transparent',
            color: '#FF9800', fontSize: 16, fontWeight: 700, cursor: 'pointer',
          }}>{idx + 1 >= deck.length ? 'Результаты →' : 'Следующий →'}</button>
        )}
      </div>
    </div>
  )
}

// ─── ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home')
  const [mode, setMode] = useState(null)
  const [group, setGroup] = useState(0)
  const [key, setKey] = useState(0) // force remount on restart

  const start = (m, g) => { setMode(m); setGroup(g); setScreen('game') }
  const back = () => setScreen('home')
  const restart = () => { setKey(k => k + 1); setScreen('game') }

  return (
    <div style={S.app}>
      <div style={S.phone}>
        <div style={S.topRainbow} />
        {screen === 'home' && <HomeScreen onStart={start} />}
        {screen === 'game' && mode === 'flashcard' && (
          <FlashcardScreen key={key} filterGroup={group} onBack={back} onRestart={restart} />
        )}
        {screen === 'game' && mode === 'quiz' && (
          <QuizScreen key={key} filterGroup={group} onBack={back} onRestart={restart} />
        )}
        {screen === 'game' && mode === 'typein' && (
          <TypeInScreen key={key} filterGroup={group} onBack={back} onRestart={restart} />
        )}
      </div>
    </div>
  )
}
