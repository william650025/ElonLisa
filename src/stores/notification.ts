import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'warning' | 'error' | 'critical'
  message: string
  duration?: number
}

let toastId = 0

export const useNotificationStore = defineStore('notification', () => {
  const toasts = ref<Toast[]>([])

  function addToast(type: Toast['type'], message: string, duration?: number) {
    const id = `toast-${++toastId}`
    const toast: Toast = {
      id,
      type,
      message,
      duration: type === 'critical' ? 0 : (duration || 4000),
    }
    toasts.value.push(toast)

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string) {
    return addToast('success', message)
  }

  function warning(message: string) {
    return addToast('warning', message)
  }

  function error(message: string) {
    return addToast('error', message)
  }

  function critical(message: string) {
    return addToast('critical', message)
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    warning,
    error,
    critical,
  }
})
