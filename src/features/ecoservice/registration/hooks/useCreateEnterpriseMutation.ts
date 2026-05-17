import { useMutation } from '@tanstack/react-query';
import { enterprisesRepository } from '@/repositories/enterprises.repository';
import type { CreateEnterprisePayload } from '@/types';

export function useCreateEnterpriseMutation() {
  return useMutation({
    mutationFn: (payload: CreateEnterprisePayload) =>
      enterprisesRepository.create(payload),
  });
}
