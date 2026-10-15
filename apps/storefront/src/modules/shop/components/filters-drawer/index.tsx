"use client"

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import { Adjustments, XMark } from "@medusajs/icons"
import { Fragment, useState } from "react"

export default function FiltersDrawer({
  children,
  resultCount,
}: {
  children: React.ReactNode
  resultCount: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="small:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-x-2 rounded-card border border-border px-3 py-1.5 text-sm text-foreground"
        aria-haspopup="dialog"
      >
        <Adjustments className="h-4 w-4" />
        Filtri
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="relative z-[60]">
          <TransitionChild
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in duration-150"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 right-0 flex w-full max-w-sm flex-col bg-background p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-medium text-foreground">
                  Filtri{" "}
                  <span className="text-sm text-muted">
                    ({resultCount} {resultCount === 1 ? "risultato" : "risultati"})
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Chiudi filtri"
                >
                  <XMark />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{children}</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 w-full rounded-card bg-coffee py-2.5 text-sm font-medium text-surface"
              >
                Mostra risultati
              </button>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  )
}
