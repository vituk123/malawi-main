import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = 'http://localhost:8080/api/auth/'; // Adjust if your backend runs on a different port or path

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signIn = async (username: string, password: string) => {
  const response = await axios.post(API_URL + 'signin', {
    username,
    password,
  });
  if (response.data.accessToken) {
    useAuthStore.getState().setAuth(response.data.accessToken, response.data.refreshToken, response.data.id, response.data.username, response.data.email, response.data.roles);
  }
  return response.data;
};

export const signUp = async (username: string, email: string, password: string, role: string) => {
  const response = await axios.post(API_URL + 'signup', {
    username,
    email,
    password,
    role: [role],
  });
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post(API_URL + 'refreshtoken', {
    refreshToken,
  });
  if (response.data.accessToken) {
    useAuthStore.getState().setToken(response.data.accessToken);
  }
  return response.data;
};

export const logout = async () => {
  await axios.post(API_URL + 'logout');
  useAuthStore.getState().clearAuth();
};

export const confirmRegistration = async (token: string) => {
  const response = await axios.get(API_URL + 'registrationConfirm', {
    params: { token },
  });
  return response.data;
};

const COMPANY_API_URL = 'http://localhost:8080/api/companies/';

export const registerCompany = async (companyData: any) => {
  const response = await api.post(COMPANY_API_URL, companyData);
  return response.data;
};

export const updateCompany = async (companyId: string, companyData: any) => {
  const response = await api.put(`${COMPANY_API_URL}${companyId}`, companyData);
  return response.data;
};

export const getCompanyById = async (companyId: string) => {
  const response = await api.get(`${COMPANY_API_URL}${companyId}`);
  return response.data;
};

export const searchCompanies = async (name: string, industry: string) => {
  const response = await api.get(`${COMPANY_API_URL}search`, {
    params: { name, industry },
  });
  return response.data;
};

export const verifyCompany = async (companyId: string) => {
  const response = await api.put(`${COMPANY_API_URL}${companyId}/verify`);
  return response.data;
};

const JOB_API_URL = 'http://localhost:8080/api/jobs/';

export const createJob = async (jobData: any) => {
  const response = await api.post(JOB_API_URL, jobData);
  return response.data;
};

export const updateJob = async (jobId: string, jobData: any) => {
  const response = await api.put(`${JOB_API_URL}${jobId}`, jobData);
  return response.data;
};

export const deleteJob = async (jobId: string) => {
  const response = await api.delete(`${JOB_API_URL}${jobId}`);
  return response.data;
};

export const getJobById = async (jobId: string) => {
  const response = await api.get(`${JOB_API_URL}${jobId}`);
  return response.data;
};

export const getAllJobs = async (page: number = 0, size: number = 10) => {
  const response = await api.get(JOB_API_URL, {
    params: { page, size },
  });
  return response.data;
};

export const searchJobs = async (title: string, location: string, company: string, page: number = 0, size: number = 10) => {
  const response = await api.get(`${JOB_API_URL}search`, {
    params: { title, location, company, page, size },
  });
  return response.data;
};

export const filterJobs = async (minSalary: number, maxSalary: number, jobType: string, location: string, page: number = 0, size: number = 10) => {
  const response = await api.get(`${JOB_API_URL}filter`, {
    params: { minSalary, maxSalary, jobType, location, page, size },
  });
  return response.data;
};

export const getJobsByCompany = async (companyId: string) => {
  const response = await api.get(`${JOB_API_URL}company/${companyId}`);
  return response.data;
};

const JOB_APPLICATION_API_URL = 'http://localhost:8080/api/applications/';

export const applyForJob = async (applicationData: any) => {
  const response = await api.post(JOB_APPLICATION_API_URL, applicationData);
  return response.data;
};

export const updateApplicationStatus = async (applicationId: string, applicationData: any) => {
  const response = await api.put(`${JOB_APPLICATION_API_URL}${applicationId}`, applicationData);
  return response.data;
};

export const getApplicationsByJob = async (jobId: string) => {
  const response = await api.get(`${JOB_APPLICATION_API_URL}job/${jobId}`);
  return response.data;
};

export const getApplicationsByUser = async (userId: string) => {
  const response = await api.get(`${JOB_APPLICATION_API_URL}user/${userId}`);
  return response.data;
};

export const withdrawApplication = async (applicationId: string) => {
  const response = await api.delete(`${JOB_APPLICATION_API_URL}${applicationId}`);
  return response.data;
};

const TEST_API_URL = 'http://localhost:8080/api/test/';

export const getPublicContent = async () => {
  const response = await axios.get(TEST_API_URL + 'all');
  return response.data;
};

export const getUserContent = async () => {
  const response = await api.get(TEST_API_URL + 'user');
  return response.data;
};

export const getEmployerContent = async () => {
  const response = await api.get(TEST_API_URL + 'employer');
  return response.data;
};

export const getAdminContent = async () => {
  const response = await api.get(TEST_API_URL + 'admin');
  return response.data;
};

export default api;
