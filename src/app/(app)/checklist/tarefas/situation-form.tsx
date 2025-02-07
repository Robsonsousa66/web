'use client'

import { Form } from '@/components/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useTasksStore } from '@/store/smartlist/smartlist-task'
import { zodResolver } from '@hookform/resolvers/zod'
import { CornerDownLeft, Loader2, Save, Trash2, Wind } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { EditActionForm } from './edit-action-form'

const changeSituationSchema = z.object({
  status: z.string({ required_error: 'Selecione um status!' }),
  description: z.string({ required_error: 'Digite uma legenda pra ação!' }),
  type: z.string({ required_error: 'Selecione o tipo da ação!' }),
  impediment: z
    .boolean({ required_error: 'Este campo e obrigatório!' })
    .default(false),
})

type ChangeSituationData = z.infer<typeof changeSituationSchema>

export type ActionType = {
  control: {
    description: string
    id: number
  }
  description: string
  id: string
  impediment: boolean
}

interface SituationForm {
  taskId: string
}

export function SituationForm({ taskId }: SituationForm) {
  const { status, types } = useTasksStore(({ status, types }) => {
    const statusFormatted = status
      ? status?.map(({ description, id }) => ({
          label: description,
          value: id.toString(),
        }))
      : []

    const typesFormatted = types
      ? types.map(({ description, id }) => ({
          label: description,
          value: id.toString(),
        }))
      : []

    return { status: statusFormatted, types: typesFormatted }
  })
  const [actions, setActions] = useState<ActionType[]>([])
  const [actionsLoading, setActionsLoading] = useState(false)

  const situationForm = useForm<ChangeSituationData>({
    resolver: zodResolver(changeSituationSchema),
  })

  const { toast } = useToast()

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
  } = situationForm

  const statusId = watch('status')

  async function handleChangeControl(data: ChangeSituationData) {
    const response = await api.post(
      `/smart-list/task/${taskId}/statusAction/${statusId}`,
      {
        controlId: Number(data.type),
        description: data.description,
        impediment: data.impediment,
      },
    )

    if (response.status === 201) {
      toast({
        title: 'Ação criada com sucesso!',
        variant: 'success',
      })

      reset({
        status: statusId,
        type: '',
        description: '',
        impediment: false,
      })
      handleChangeStatus()
    }
  }

  useEffect(() => {
    if (!statusId) return

    handleChangeStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusId])

  async function handleChangeStatus() {
    setActions([])
    setActionsLoading(true)
    const response = await api
      .get(`/smart-list/task/${taskId}/statusAction/${statusId}`)
      .then((res) => res.data)

    setActions(response.statusAction)
    setActionsLoading(false)
  }

  async function handleDeleteAction(actionId: string) {
    const response = await api
      .delete(`/smart-list/task/${taskId}/statusAction/${statusId}/${actionId}`)
      .then((res) => res.data)

    if (response.deleted) {
      toast({
        title: 'Ação deletada com sucesso!',
        variant: 'success',
      })

      handleChangeStatus()
    }
  }

  return (
    <FormProvider {...situationForm}>
      <div className="ov flex h-full flex-col gap-4 overflow-auto">
        <form
          onSubmit={handleSubmit(handleChangeControl)}
          className="mt-4 flex w-full flex-col gap-3"
        >
          <Form.Field>
            <Form.Label>Controle:</Form.Label>
            <Form.Select name="status" options={status} />
            <Form.ErrorMessage field="status" />
          </Form.Field>

          <Form.Field>
            <Form.Label>Descrição:</Form.Label>
            <Form.Input name="description" />
            <Form.ErrorMessage field="description" />
          </Form.Field>

          <Form.Field>
            <Form.Label>Tipo:</Form.Label>
            <Form.Select name="type" options={types} />
            <Form.ErrorMessage field="type" />
          </Form.Field>

          <Form.Field className="flex-row">
            <Form.Checkbox id="impeditive" name="impediment" />
            <Form.Label htmlFor="impeditive">Impeditivo</Form.Label>
            <Form.ErrorMessage field="impeditive" />
          </Form.Field>

          <Button loading={isSubmitting} disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            Salvar situação
          </Button>
        </form>
        <Separator />
        {actionsLoading ? (
          <div className="flex w-full items-center justify-center gap-4 p-4">
            <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
            <span className="text-slate-700">Carregando...</span>
          </div>
        ) : (
          <div className="flex h-full flex-1 flex-col gap-3 overflow-auto">
            {actions.length > 0 ? (
              actions.map((action) => {
                const { id, description, control } = action
                return (
                  <div
                    key={id}
                    className="flex justify-between rounded-2xl border p-4"
                  >
                    <div className="flex gap-2 divide-x divide-slate-300">
                      <span>{control.description}</span>
                      <span className="pl-2 font-semibold text-slate-700">
                        {description}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon-xs"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogTitle>
                            Tem certeza que deseja deletar essa ação?
                          </AlertDialogTitle>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              <CornerDownLeft className="h-4 w-4" />
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAction(id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Sim, excluir!
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <EditActionForm
                        loadActions={handleChangeStatus}
                        statusId={statusId}
                        taskId={taskId}
                        {...action}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-3">
                <span className="flex aspect-square h-14 items-center justify-center rounded-full bg-violet-200 text-violet-500">
                  <Wind className="h-6 w-6" />
                </span>
                <span className="text-slate-700">Nenhum dado encontrado!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </FormProvider>
  )
}
