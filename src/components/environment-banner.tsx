import { cn } from '@/lib/utils'

export interface EnvironmentBannerProps {
  /** Which deployment this is. Production renders nothing. */
  environment: 'development' | 'staging' | 'production'
  /** Whether the app is actually serving MSW fixtures instead of a real backend. */
  enableMocking: boolean
  className?: string
}

const TONES = {
  development: 'bg-secondary text-secondary-foreground',
  staging: 'bg-destructive/15 text-destructive',
} as const

/**
 * A standing reminder of which deployment you are looking at.
 *
 * Renders nothing in production — the whole point is that you notice when you
 * are NOT in production, so nobody demos staging to a customer or files a bug
 * against fixture data.
 *
 * Presentational: it takes the environment and mocking state as props and has
 * no idea that a `config.json` exists. `AppLayout` reads the config and passes
 * both down.
 */
export function EnvironmentBanner({
  environment,
  enableMocking,
  className,
}: EnvironmentBannerProps) {
  if (environment === 'production') return null

  const label = environment === 'development' ? 'Development' : 'Staging'
  const text = enableMocking ? `${label} — data is mocked` : `${label} — not production data`
  const tone = TONES[environment]

  return (
    <div
      role="status"
      className={cn('px-4 py-1.5 text-center text-xs font-medium', tone, className)}
    >
      {text}
    </div>
  )
}
