import { api } from '@/lib/api'
import { create } from 'zustand'

export type ActionItem = {
  id: number
  actionId: number | null
  description: string | null
  equipment: string
  branch: string
  branchId: number
  responsible: {
    login: string
    name: string
  } | null
  startDate: string
  endDate: string | null
  doneAt: string | null
  task: string
  status: string
  descriptionAction: string | null
}

interface StoreData {
  actionList: Array<ActionItem> | undefined
  currentTask: ActionItem | undefined
  responsible:
    | Array<{
        login: string
        name: string
      }>
    | undefined

  attach: Array<{ url: string }> | undefined
  selectedTasks: string[]
  groups: Array<{ id: number; title: string }> | undefined

  fetchDataTable: (params: { index: number; perPage: number }) => Promise<any>
  fetchDataTableGroups: (params: {
    index: number
    perPage: number
  }) => Promise<any>
  fetchResponsible: (branchId: number) => Promise<void>
  fetchAttach: (actionId: number) => Promise<Array<{ url: string }>>
  fetchListGroup: (branchId: string) => Promise<void>
  setCurrentTask: (task: ActionItem) => void
  clearAttach: () => void
  updateSelectedTasks: (tasks: string[]) => void
}

export const useActionsStore = create<StoreData>((set, get) => {
  return {
    actionList: undefined,
    currentTask: undefined,
    responsible: undefined,
    attach: undefined,
    selectedTasks: [],
    groups: undefined,

    async fetchDataTable(params: { index: number; perPage: number }) {
      return api
        .get('/smart-list/action', {
          params,
        })
        .then((res) => res.data)
    },

    async fetchDataTableGroups(params: { index: number; perPage: number }) {
      return api
        .get('/smart-list/action/group', {
          params,
        })
        .then((res) => res.data)
    },

    fetchResponsible: async (branchId) => {
      set({ responsible: undefined })

      const response = await api
        .get('/smart-list/action/responsible', {
          params: {
            branchId,
          },
        })
        .then((res) => res.data)
        .catch(() => set({ responsible: [] }))

      set({ responsible: response.responsible })
    },

    fetchAttach: async (actionId) => {
      set({ attach: undefined })

      const response = await api
        .get(`/smart-list/action/attach/${actionId}`)
        .then((res) => res.data)
        .catch(() => set({ attach: [] }))

      set({ attach: response.img })

      return response.img
    },

    clearAttach: () => {
      set({ attach: undefined })
    },

    setCurrentTask: (task) => {
      set({ currentTask: task })
    },

    updateSelectedTasks: (tasks: string[]) => {
      set({ selectedTasks: tasks })
    },

    fetchListGroup: async (branchId) => {
      const response = await api
        .get(`smart-list/action/list-group/${branchId}`)
        .then((res) => res.data)

      set({ groups: response.groups })
    },
  }
})
