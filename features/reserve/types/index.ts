export interface FormFieldProps {
  label: string
  id: string
  icon: React.ReactNode
  type?: 'text' | 'tel' | 'datetime-local' | 'email'
  placeholder?: string
  required?: boolean
}

export interface ReservationFormData {
  name: string
  dept: string
  phone: string
  startTime: Date | undefined
  endTime: Date | undefined
  purpose: string
  destination: string
}
