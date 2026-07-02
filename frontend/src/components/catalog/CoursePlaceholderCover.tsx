const PALETTE = [
  { from: '#3d2f1f', to: '#241a10', ink: '#e8b452' },
  { from: '#2f3a2a', to: '#1a2216', ink: '#a8c48f' },
  { from: '#26313d', to: '#141b23', ink: '#8fb4c4' },
  { from: '#3a2735', to: '#211420', ink: '#c98fb0' },
  { from: '#3d3320', to: '#221c10', ink: '#d3a039' },
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function initials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

interface CoursePlaceholderCoverProps {
  slug: string
  title: string
}

export function CoursePlaceholderCover({ slug, title }: CoursePlaceholderCoverProps) {
  const tone = PALETTE[hashString(slug) % PALETTE.length]
  return (
    <div
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden"
      style={{ backgroundImage: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 10px)',
        }}
      />
      <span className="font-display text-4xl font-semibold tracking-tight" style={{ color: tone.ink }}>
        {initials(title)}
      </span>
    </div>
  )
}
