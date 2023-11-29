'use client'

import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { useLoading } from '@/store/loading-store'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, Timer } from 'lucide-react'
import { useState } from 'react'
import { SheetAction } from './sheet-action'

export function GridActions() {
  const [sheetActionOpen, setSheetActionOpen] = useState<boolean>(false)
  const { show, hide } = useLoading()
  const {
    setCurrentTask,
    fetchResponsible,
    fetchAttach,
    clearAttach,
    selectedTasks,
    updateSelectedTasks,
    fetchDataTable,
  } = useActionsStore(({ attach, ...rest }) => ({
    attach: attach?.map(({ url }) => url),
    ...rest,
  }))
  const { toast } = useToast()

  function handleToggleSelected({ taskId }: { taskId: string }) {
    const currentTasks = selectedTasks || []
    if (currentTasks.includes(taskId)) {
      updateSelectedTasks(currentTasks.filter((id) => id !== taskId))
    } else updateSelectedTasks([...currentTasks, taskId])
    console.log(taskId, currentTasks)
  }

  async function handleOpenSheetAction(task: ActionItem) {
    setCurrentTask(task)
    fetchResponsible(task.id)
    clearAttach()
    if (task.actionId) {
      fetchAttach(task.actionId)
    }
    setSheetActionOpen(true)
  }

  // async function loadAttach(actionId: number | null) {
  //   if (!actionId) return
  //   clearAttach()
  //   show()
  //   const responseAttach = await fetchAttach(actionId)
  //   hide()
  //   if (responseAttach.length > 0) {
  //     setAttachModalOpen(true)
  //     return
  //   }

  //   toast({
  //     title: 'Nenhum anexo encontrado nessa ação!',
  //   })
  // }

  const columns: ColumnDef<ActionItem>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const task = row.original as ActionItem
        return (
          <div className="flex gap-2">
            <Checkbox
              name="task"
              checked={row.getIsSelected()}
              onClick={() => handleToggleSelected({ taskId: String(task.id) })}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
            {/* <Button size="icon-xs" onClick={() => handleOpenSheetAction(task)}>
              <Timer className="h-3 w-3" />
            </Button>
            <Button
              variant="secondary"
              disabled={!task.actionId}
              size="icon-xs"
              onClick={() => loadAttach(task.actionId)}
            >
              <Image className="h-3 w-3" />
            </Button> */}
          </div>
        )
      },
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Criado em
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const createdAt = row.getValue('startDate') as string

        return createdAt
          ? dayjs(createdAt).format('DD/MM/YYYY')
          : 'Sem registro'
      },
    },
    {
      accessorKey: 'task',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Verificação
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Prazo
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const deadline = row.getValue('endDate') as string

        return deadline ? dayjs(deadline).format('DD/MM/YYYY') : 'Sem registro'
      },
    },
    {
      accessorKey: 'equipment',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Equipamento
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'branch',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Local
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'responsible.name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Responsável
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  return (
    <div className="flex h-full flex-col">
      {selectedTasks.length > 0 && (
        <Button className="mb-2 self-end">
          <Timer />
          Criar ação
        </Button>
      )}
      <DataTableServerPagination
        id="action-table"
        columns={columns}
        fetchData={fetchDataTable}
      />

      <SheetAction open={sheetActionOpen} onOpenChange={setSheetActionOpen} />

      {/* <AttachThumbList
        images={attach || []}
        open={attachModalOpen}
        onOpenChange={setAttachModalOpen}
      /> */}
    </div>
  )
}
