"use client";

import { Dialog } from "@headlessui/react";

export default function ConfirmModal({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Submit Quiz?
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Are you sure you want to submit your answers? You won't be able to change them after submission.
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-zinc-200 dark:bg-zinc-700 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600"
            >
              Yes, Submit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
