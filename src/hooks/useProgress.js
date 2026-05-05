import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { supabase } from '../lib/supabase'

const GUEST_KEY = 'norsk-progress:guest'

export default function useProgress() {
  const { userId } = useAuth()
  const [readIds, setReadIds] = useState([])

  useEffect(() => {
    if (userId) {
      let cancelled = false
      supabase
        .from('progress')
        .select('text_id')
        .eq('user_id', userId)
        .then(async ({ data, error }) => {
          if (cancelled) return
          if (error) {
            console.error('Failed to load progress:', error)
            setReadIds([])
            return
          }
          const cloudIds = (data || []).map((d) => d.text_id)

          // Миграция гостя, если облако пустое
          if (cloudIds.length === 0) {
            const localGuest = localStorage.getItem(GUEST_KEY)
            if (localGuest) {
              try {
                const localIds = JSON.parse(localGuest)
                if (Array.isArray(localIds) && localIds.length > 0) {
                  const rows = localIds.map((id) => ({ user_id: userId, text_id: id }))
                  await supabase.from('progress').insert(rows)
                  if (!cancelled) setReadIds(localIds)
                  return
                }
              } catch (e) {
                console.warn('Progress migration failed', e)
              }
            }
          }

          setReadIds(cloudIds)
        })
      return () => { cancelled = true }
    } else {
      const saved = localStorage.getItem(GUEST_KEY)
      setReadIds(saved ? JSON.parse(saved) : [])
    }
  }, [userId])

  useEffect(() => {
    if (!userId) {
      localStorage.setItem(GUEST_KEY, JSON.stringify(readIds))
    }
  }, [readIds, userId])

  async function markAsRead(id) {
    if (readIds.includes(id)) return
    setReadIds([...readIds, id])
    if (userId) {
      const { error } = await supabase.from('progress').insert({ user_id: userId, text_id: id })
      if (error && !error.message.includes('duplicate')) {
        console.error('Failed to mark as read:', error)
      }
    }
  }

  async function unmarkAsRead(id) {
    setReadIds(readIds.filter((r) => r !== id))
    if (userId) {
      const { error } = await supabase.from('progress')
        .delete()
        .eq('user_id', userId)
        .eq('text_id', id)
      if (error) console.error('Failed to unmark:', error)
    }
  }

  function isRead(id) {
    return readIds.includes(id)
  }

  return { readIds, markAsRead, unmarkAsRead, isRead }
}
