import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InputVehicle } from '../types/input-vehicle'
import { toast } from 'sonner'

export function useCreateVehicle() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: InputVehicle) => {
      const res = await fetch('/api/admin/vehicles', {
        method: 'POST',
        body: JSON.stringify(input),
      })

      return res.json()
    },

    onSuccess: () => {
      toast.success('차량이 등록되었습니다.')
      qc.invalidateQueries({
        queryKey: ['admin-vehicles'],
      })
    },
  })
}
