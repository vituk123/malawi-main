import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  status?: string;
}

const fetchJobs = async (): Promise<Job[]> => {
  const { data } = await api.get<Job[]>('/api/jobs');
  return data;
};

export const useJobs = () => {
  return useQuery<Job[], Error>({ queryKey: ['jobs'], queryFn: fetchJobs });
};
