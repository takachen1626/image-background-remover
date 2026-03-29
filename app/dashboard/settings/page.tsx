'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

export const runtime = 'edge'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">Settings</h1>
        <p className="text-white/30 text-sm mt-1">Manage your account preferences.</p>
      </div>

      {/* Profile section */}
      <div
        className="rounded-2xl border border-white/8 p-6 mb-5"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="avatar"
              width={56}
              height={56}
              className="rounded-2xl"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div>
            <p className="font-medium text-white/80">{session?.user?.name}</p>
            <p className="text-sm text-white/40">{session?.user?.email}</p>
            <p className="text-xs text-white/25 mt-1">Signed in via Google — profile is managed by Google.</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div
        className="rounded-2xl border border-white/8 p-6 mb-5"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Auto-save to History</p>
              <p className="text-xs text-white/30">Save processed images to local browser history</p>
            </div>
            {/* Toggle — TODO: wire to localStorage preference */}
            <div
              className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
              style={{ background: 'rgba(124,58,237,0.6)' }}
            >
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow" />
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-2xl border border-red-500/15 p-6"
        style={{ background: 'rgba(239,68,68,0.03)' }}
      >
        <h2 className="text-sm font-semibold text-red-400/70 uppercase tracking-widest mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Sign Out</p>
              <p className="text-xs text-white/30">Log out of your account on this device</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70 transition"
            >
              Sign Out
            </button>
          </div>
          <div className="border-t border-white/5 pt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Delete Account</p>
              <p className="text-xs text-white/30">Permanently delete your account and all data</p>
            </div>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium border border-red-500/20 text-red-400/60 hover:border-red-500/40 hover:text-red-400 transition"
              >
                Delete Account
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/40 hover:text-white/60 transition"
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
                  onClick={() => alert('TODO: call DELETE /api/user')}
                >
                  Confirm Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
