import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InputVehicle } from '../types/input-vehicle'
import { toast } from 'sonner'

export function useUpdateVehicle() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: { id: string; data: InputVehicle }) => {
      const res = await fetch(`/api/admin/vehicles/${input.id}`, {
        method: 'PATCH',
        body: JSON.stringify(input.data),
      })

      return res.json()
    },

    onSuccess: () => {
      toast.success('차량 정보가 업데이트되었습니다.')
      qc.invalidateQueries({
        queryKey: ['admin-vehicles'],
      })
    },
  })
}
