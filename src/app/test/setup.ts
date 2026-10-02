import '@testing-library/jest-dom/vitest'
import '../i18n'

import { cleanup } from '@testing-library/react'
import i18next from 'i18next'
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'

import { sessionStore } from '@/entities/session'
import { server } from '@/shared/mocks/node'

import { configureApp } from '../setup/configureApp'

// jsdom does not implement the native <dialog> API yet.
if (!('showModal' in HTMLDialogElement.prototype)) {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      value(this: HTMLDialogElement) {
        this.open = true
      },
    },
    close: {
      value(this: HTMLDialogElement) {
        this.open = false
        this.dispatchEvent(new Event('close'))
      },
    },
  })
}

beforeAll(async () => {
  server.listen({ onUnhandledFrame: 'error' })
  await i18next.changeLanguage('en')
})

beforeEach(() => {
  configureApp()
  // <ScrollRestoration /> calls window.scrollTo, which jsdom does not implement.
  vi.spyOn(globalThis, 'scrollTo').mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  sessionStore.clear()
  localStorage.clear()
})

afterAll(() => {
  server.close()
})
