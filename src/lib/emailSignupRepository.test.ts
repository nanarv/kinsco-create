import { describe, expect, it } from 'vitest'
import { createFakeClient } from './testHelpers/fakeSupabaseClient'
import { submitEmailSignup } from './emailSignupRepository'

describe('submitEmailSignup', () => {
  it('inserts a row into the email_signups table with the email', async () => {
    const { client, calls } = createFakeClient()

    await submitEmailSignup('player@example.com', client)

    expect(calls).toEqual([{ table: 'email_signups', payload: { email: 'player@example.com' } }])
  })

  it('never includes anything beyond email in the insert payload', async () => {
    const { client, calls } = createFakeClient()

    await submitEmailSignup('player@example.com', client)

    expect(Object.keys(calls[0].payload as object)).toEqual(['email'])
  })
})
