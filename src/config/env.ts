import { z } from 'zod'

/**
 * Runtime configuration.
 *
 * This app is built ONCE and promoted through environments. Nothing about an
 * environment is baked into the bundle — `/config.json` is fetched at boot and
 * validated against the schema below, so the artifact you tested in staging is
 * byte-for-byte the artifact that reaches production.
 *
 * Two consequences worth remembering:
 *
 *  1. Everything here is PUBLIC. It is served to the browser as plain JSON.
 *     Never put a secret in it. There is no server side in an SPA.
 *
 *  2. Nothing outside this module should read configuration directly. ESLint
 *     enforces that — see the `no-restricted-syntax` rule in eslint.config.js.
 */
const configSchema = z.object({
  /** Base URL of the API. Relative ("/api") or absolute ("https://api.example.com"). */
  apiUrl: z.string().min(1),

  /** Which environment this deployment is. Drives logging, analytics, banners. */
  environment: z.enum(['development', 'staging', 'production']),

  /** Serve the app from MSW fixtures instead of a real backend. Dev only. */
  enableMocking: z.boolean().default(false),

  /** Optional error-reporting sink. */
  sentryDsn: z.string().optional(),
})

export type AppConfig = z.infer<typeof configSchema>

let config: AppConfig | undefined

/**
 * Fetch and validate `/config.json`. Must resolve before the app renders.
 *
 * Fails loudly and early: a missing or malformed variable takes down boot with
 * a message naming the offending field, rather than surfacing as a mystery
 * `undefined` deep in a request three screens later.
 */
export async function loadConfig(): Promise<AppConfig> {
  const response = await fetch('/config.json', { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(
      `Could not load /config.json (HTTP ${response.status}). ` +
        `The deployment must serve a config.json — see config.example.json.`,
    )
  }

  const parsed = configSchema.safeParse(await response.json())

  if (!parsed.success) {
    throw new Error(`Invalid /config.json:\n${z.prettifyError(parsed.error)}`)
  }

  config = parsed.data
  return config
}

/**
 * The validated config. Throws if called before `loadConfig()` has resolved,
 * which can only happen if someone reads config outside the React tree.
 */
export function getConfig(): AppConfig {
  if (!config) {
    throw new Error('getConfig() called before loadConfig() resolved.')
  }
  return config
}

/** Test seam: inject a config without going over the network. */
export function setConfig(override: AppConfig): void {
  config = override
}
