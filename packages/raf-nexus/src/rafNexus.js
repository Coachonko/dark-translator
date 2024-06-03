import { detectIsEmpty } from '@dark-engine/core'

export class RafNexus {
  callbacks
  now

  constructor() {
    this.callbacks = []
    this.now = performance.now()
    requestAnimationFrame(this.raf)
  }

  addSortFn = (a, b) => a.priority - b.priority
  removeFilterFn = (callbackToRemove) => ({ callback: cb }) => callbackToRemove !== cb

  add = (callback, priority) => {
    if (detectIsEmpty(priority)) {
      priority = 0
    }
    this.callbacks.push({ callback, priority })
    this.callbacks.sort(this.addSortFn)

    return () => this.remove(callback)
  }

  remove = (callbackToRemove) => {
    this.callbacks = this.callbacks.filter(this.removeFilterFn(callbackToRemove))
  }

  raf = (now) => {
    requestAnimationFrame(this.raf)

    const deltaTime = now - this.now
    this.now = now

    for (let i = 0, len = this.callbacks.length; i < len; i++) {
      this.callbacks[i].callback(now, deltaTime)
    }
  }
}
