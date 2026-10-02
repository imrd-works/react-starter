import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './Modal'

describe('Modal', () => {
  it('opens as a labelled dialog and closes via the close button', async () => {
    const onClose = vi.fn<() => void>()
    render(
      <Modal open title="Confirm" onClose={onClose} footer={<span>Footer</span>}>
        Are you sure?
      </Modal>
    )

    const dialog = screen.getByRole('dialog', { name: 'Confirm' })
    expect(dialog).toHaveAttribute('open')
    expect(screen.getByText('Footer')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes on backdrop click but not on content click', async () => {
    const onClose = vi.fn<() => void>()
    render(
      <Modal open title="Confirm" onClose={onClose}>
        Body
      </Modal>
    )

    await userEvent.click(screen.getByText('Body'))
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('is not rendered as open when closed', () => {
    render(
      <Modal open={false} title="Hidden" onClose={vi.fn<() => void>()}>
        Body
      </Modal>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
