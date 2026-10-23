import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api/client'
import type { components } from '@/api/schema'

export type ReferenceItem = components['schemas']['ReferenceRow']
export type Employee = components['schemas']['Employee']
export type EmployeeInput = components['schemas']['EmployeeInput']
export type EmployeeMutationInput = components['schemas']['EmployeeMutationInput']

const employeeKey = ['people', 'employees'] as const
const referenceKey = (kind: string) => ['people', kind] as const

export function useEmployees(enabled: boolean) {
  return useQuery({
    queryKey: employeeKey,
    queryFn: () => api<Employee[]>('/people/employees'),
    enabled,
    retry: 1,
  })
}

export function useReferences(kind: 'departments' | 'grades' | 'locations', enabled: boolean) {
  return useQuery({
    queryKey: referenceKey(kind),
    queryFn: () => api<ReferenceItem[]>(`/people/${kind}`),
    enabled,
    retry: 1,
  })
}

export function useCreateEmployee() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: EmployeeInput) =>
      api<Employee>('/people/employees', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => client.invalidateQueries({ queryKey: employeeKey }),
  })
}

export function useUpdateEmployee() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EmployeeMutationInput }) =>
      api<Employee>(`/people/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: () => client.invalidateQueries({ queryKey: employeeKey }),
  })
}

export function useEmployeeLifecycle(action: 'archive' | 'restore') {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api<void>(`/people/employees/${id}/${action}`, { method: 'POST' }),
    onSuccess: () => client.invalidateQueries({ queryKey: employeeKey }),
  })
}

export function useCreateReference(kind: 'departments' | 'grades' | 'locations') {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: Record<string, string | number | null>) =>
      api<ReferenceItem>(`/people/${kind}`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => client.invalidateQueries({ queryKey: referenceKey(kind) }),
  })
}
