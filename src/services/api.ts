import axios from 'axios';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

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

// Helper function to show success notifications
export const showSuccessNotification = (message: string) => {
  toast.success(message);
};

// Helper function to show error notifications
export const showErrorNotification = (message: string) => {toast.error(message)
};


export const signIn = async (username: string, password: string) => {
  try {
  const response = await axios.post(API_URL + 'signin', {
    username,
    password,
  });
  if (response.data.accessToken) {
    useAuthStore.getState().setAuth(response.data.accessToken, response.data.refreshToken, response.data.id, response.data.username, response.data.email, response.data.roles);
  }
  return response.data;
};
  } catch (error) {
    showErrorNotification("Sign in failed. Please check your credentials.");
    throw error; // Re-throw the error so the component can handle it if needed
  }
};

export const signUp = async (username: string, email: string, password: string, role: string) => {
  try {
  const response = await axios.post(API_URL + 'signup', {
    username,
    email,
    password,
    role: [role],
  });
    showSuccessNotification("Signed up successfully! Please confirm your email.");
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
  } catch (error) {
    showErrorNotification("Sign up failed. Please try again.");
    throw error; // Re-throw the error
  }
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
  try {
    const response = await api.post(JOB_API_URL, jobData);
    showSuccessNotification('Job created successfully!');
    return response.data;
  } catch (error) {
    showErrorNotification('Failed to create job. Please try again.');
    throw error;
  }
};

export const updateJob = async (jobId: string, jobData: any) => {
  try {
    const response = await api.put(`${JOB_API_URL}${jobId}`, jobData);
    showSuccessNotification('Job updated successfully!');
    return response.data;
  } catch (error) {
    showErrorNotification('Failed to update job. Please try again.');
    throw error;
  }
};

export const deleteJob = async (jobId: string) => {
  try {
    const response = await api.delete(`${JOB_API_URL}${jobId}`);
    showSuccessNotification('Job deleted successfully!');
    return response.data;
  } catch (error) {
    showErrorNotification('Failed to delete job. Please try again.');
    throw error;
  }
};

export const getJobById = async (jobId: string) => {
  try {
    const response = await api.get(`${JOB_API_URL}${jobId}`);
    return response.data;
  } catch (error) {
    throw error; // Re-throw, component handles display
  }
};

export const getAllJobs = async (page: number = 0, size: number = 10) => {
 try {
 const response = await api.get(JOB_API_URL, {
 params: { page, size },
 });
 return response.data;
  } catch (error) {
    console.error("Failed to fetch jobs from backend, using mock data:", error);
    // Return mock data if backend call fails
 return {
 content: generateMockJobs(page, size),
 totalElements: 20, // Assuming 20 mock jobs
 totalPages: Math.ceil(20 / size),
 number: page,
 size: size,
    };
  }
};

// Function to generate mock job data
const generateMockJobs = (page: number, size: number) => {
  const mockJobs = [
    {
      id: 'mock-1',
      title: "Aquaculture Specialist at Lake Malawi Fisheries",
      description: "Seeking an experienced Aquaculture Specialist to manage fish farming operations on Lake Malawi. Responsibilities include breeding, feeding, disease management, and sustainable practices.",
      location: "Salima",
      salary: "MWK 800,000 - 1,200,000 per month",
      jobType: "Full-time",
      companyName: "Malawi Aqua Ventures"
    },
    {
      id: 'mock-2',
      title: "Community Development Officer - Rural Initiative",
      description: "Join our NGO to work with rural communities in implementing sustainable development projects focusing on agriculture and education. Requires strong community engagement skills.",
      location: "Dedza",
      salary: "MWK 500,000 - 700,000 per month",
      jobType: "Full-time",
      companyName: "Malawi Rural Uplift"
    },
    {
      id: 'mock-3',
      title: "Frontend Developer - Blantyre Tech Hub",
      description: "Innovative tech company seeking a talented Frontend Developer with React/TypeScript experience to build user interfaces for our new e-commerce platform.",
      location: "Blantyre",
      salary: "MWK 700,000 - 1,100,000 per month",
      jobType: "Full-time",
      companyName: "Nyasa Digital Solutions"
    },
    {
      id: 'mock-4',
      title: "Tourism Marketing Manager - Shire Highlands Resorts",
      description: "Promote our resorts and tourism packages to local and international markets. Requires experience in digital marketing and the tourism industry.",
      location: "Thyolo",
      salary: "MWK 900,000 - 1,300,000 per month",
      jobType: "Full-time",
      companyName: "Shire Eco Resorts"
    },
    {
      id: 'mock-5',
      title: "Agricultural Economist - Research Institute",
      description: "Conduct research on agricultural markets, policies, and food security in Malawi. Requires a strong background in economics and research methodology.",
      location: "Lilongwe",
      salary: "MWK 1,000,000 - 1,500,000 per month",
      jobType: "Full-time",
      companyName: "Malawi Agri Research"
    },
    { title: "Renewable Energy Technician", id: 'mock-6', description: "Install, maintain, and repair solar panels and other renewable energy systems in rural and urban areas. Technical training and field experience required.", location: "Mzuzu", salary: "MWK 400,000 - 600,000 per month", jobType: "Full-time", companyName: "SunPower Malawi" },
    { title: "Healthcare Administrator - District Hospital", id: 'mock-7', description: "Manage the administrative operations of a busy district hospital, including budgeting, staffing, and patient records. Healthcare management experience essential.", location: "Zomba", salary: "MWK 850,000 - 1,250,000 per month", jobType: "Full-time", companyName: "Malawi Health Services" },
    { title: "Environmental Consultant - Conservation Project", id: 'mock-8', description: "Provide expertise on environmental impact assessments and sustainable practices for a conservation project in a national park.", location: "Kasungu", salary: "MWK 950,000 - 1,400,000 per month", jobType: "Contract", companyName: "Malawi Wildlife Trust" },
    { title: "ICT Support Officer - Education Sector", id: 'mock-9', description: "Provide IT support and training to schools and educational institutions across the country. Experience with educational technology is a plus.", location: "Nationwide (based in Lilongwe)", salary: "MWK 600,000 - 900,000 per month", jobType: "Full-time", companyName: "Malawi Education Tech" },
    { title: "Financial Analyst - Investment Firm", id: 'mock-10', description: "Analyze financial data, prepare reports, and provide recommendations for investment strategies. Requires a strong finance background.", location: "Blantyre", salary: "MWK 1,100,000 - 1,600,000 per month", jobType: "Full-time", companyName: "Mulanje Investments" },
     { title: "Cotton Farm Manager", id: 'mock-11', description: "Oversee operations at a large-scale cotton farm, including planting, harvesting, and labor management.", location: "Salima", salary: "MWK 700,000 - 1,000,000 per month", jobType: "Full-time", companyName: "Central Cotton Growers" },
    { title: "Textile Designer - Local Fabrications", id: 'mock-12', description: "Creative designer needed to develop new textile patterns inspired by Malawian culture for clothing and home goods.", location: "Blantyre", salary: "MWK 450,000 - 650,000 per month", jobType: "Full-time", companyName: "Chitenge Creations" },
    { title: "Water Engineer - Rural Access Project", id: 'mock-13', description: "Design and supervise the construction of boreholes and water supply systems in rural communities.", location: "Mzuzu", salary: "MWK 900,000 - 1,300,000 per month", jobType: "Full-time", companyName: "Malawi Water Initiative" },
    { title: "Forestry Officer - Sustainable Logging", id: 'mock-14', description: "Manage sustainable logging practices and reforestation efforts in designated forest areas.", location: "Dedza", salary: "MWK 600,000 - 850,000 per month", jobType: "Full-time", companyName: "Malawi Timber & Forestry" },
    { title: "Graphic Designer - Marketing Agency", id: 'mock-15', description: "Talented graphic designer to create visual content for various clients, including logos, brochures, and social media graphics.", location: "Lilongwe", salary: "MWK 550,000 - 750,000 per month", jobType: "Full-time", companyName: "Capital City Creatives" },
    { title: "Mining Geologist - Exploration", id: 'mock-16', description: "Join a team exploring for mineral deposits in potential mining areas across Malawi.", location: "Northern Region (various)", salary: "MWK 1,200,000 - 1,800,000 per month", jobType: "Contract", companyName: "Malawi Mineral Prospectors" },
    { title: "Lecturer in Public Health - University", id: 'mock-17', description: "Teach and conduct research in public health, focusing on Malawian health challenges.", location: "Zomba", salary: "MWK 1,000,000 - 1,500,000 per month", jobType: "Full-time", companyName: "University of Malawi" },
    { title: "Supply Chain Coordinator - FMCG", id: 'mock-18', description: "Manage the logistics and distribution of fast-moving consumer goods across the country.", location: "Blantyre", salary: "MWK 750,000 - 1,150,000 per month", jobType: "Full-time", companyName: "Southern Goods Distribution" },
    { title: "Social Worker - Child Protection Services", id: 'mock-19', description: "Work with vulnerable children and families, providing support and ensuring child protection.", location: "Nationwide (various districts)", salary: "MWK 500,000 - 700,000 per month", jobType: "Full-time", companyName: "Malawi Child Services" },
    { title: "IT Security Analyst - Banking Sector", id: 'mock-20', description: "Ensure the security of our banking systems and protect against cyber threats.", location: "Lilongwe", salary: "MWK 1,300,000 - 1,900,000 per month", jobType: "Full-time", companyName: "Malawi National Bank" }
  ];

  const startIndex = page * size;
  const endIndex = startIndex + size;
  return mockJobs.slice(startIndex, endIndex);
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
  try {
    const response = await api.post(JOB_APPLICATION_API_URL, applicationData);
    showSuccessNotification('Application submitted successfully!');
    return response.data;
  } catch (error) {
    showErrorNotification('Failed to submit application. Please try again.');
    throw error;
  };
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

export const addRandomJobs = async () => {
  const randomJobs = [
    {
      title: "Aquaculture Specialist at Lake Malawi Fisheries",
      description: "Seeking an experienced Aquaculture Specialist to manage fish farming operations on Lake Malawi. Responsibilities include breeding, feeding, disease management, and sustainable practices.",
      location: "Salima",
      salary: "MWK 800,000 - 1,200,000 per month",
      jobType: "Full-time",
      companyName: "Malawi Aqua Ventures"
    },
    {
      title: "Community Development Officer - Rural Initiative",
      description: "Join our NGO to work with rural communities in implementing sustainable development projects focusing on agriculture and education. Requires strong community engagement skills.",
      location: "Dedza",
      salary: "MWK 500,000 - 700,000 per month",
      jobType: "Full-time",
      companyName: "Malawi Rural Uplift"
    },
    {
      title: "Frontend Developer - Blantyre Tech Hub",
      description: "Innovative tech company seeking a talented Frontend Developer with React/TypeScript experience to build user interfaces for our new e-commerce platform.",
      location: "Blantyre",
      salary: "MWK 700,000 - 1,100,000 per month",
      jobType: "Full-time",
      companyName: "Nyasa Digital Solutions"
    },
    {
      title: "Tourism Marketing Manager - Shire Highlands Resorts",
      description: "Promote our resorts and tourism packages to local and international markets. Requires experience in digital marketing and the tourism industry.",
      location: "Thyolo",
      salary: "MWK 900,000 - 1,300,000 per month",
      jobType: "Full-time",
      companyName: "Shire Eco Resorts"
    },
    {
      title: "Agricultural Economist - Research Institute",
      description: "Conduct research on agricultural markets, policies, and food security in Malawi. Requires a strong background in economics and research methodology.",
      location: "Lilongwe",
      salary: "MWK 1,000,000 - 1,500,000 per month",
      jobType: "Full-time",
      companyName: "Malawi Agri Research"
    },
    {
      title: "Renewable Energy Technician",
      description: "Install, maintain, and repair solar panels and other renewable energy systems in rural and urban areas. Technical training and field experience required.",
      location: "Mzuzu",
      salary: "MWK 400,000 - 600,000 per month",
      jobType: "Full-time",
      companyName: "SunPower Malawi"
    },
    {
      title: "Healthcare Administrator - District Hospital",
      description: "Manage the administrative operations of a busy district hospital, including budgeting, staffing, and patient records. Healthcare management experience essential.",
      location: "Zomba",
      salary: "MWK 850,000 - 1,250,000 per month",
      jobType: "Full-time",
      companyName: "Malawi Health Services"
    },
    {
      title: "Environmental Consultant - Conservation Project",
      description: "Provide expertise on environmental impact assessments and sustainable practices for a conservation project in a national park.",
      location: "Kasungu",
      salary: "MWK 950,000 - 1,400,000 per month",
      jobType: "Contract",
      companyName: "Malawi Wildlife Trust"
    },
    {
      title: "ICT Support Officer - Education Sector",
      description: "Provide IT support and training to schools and educational institutions across the country. Experience with educational technology is a plus.",
      location: "Nationwide (based in Lilongwe)",
      salary: "MWK 600,000 - 900,000 per month",
      jobType: "Full-time",
      companyName: "Malawi Education Tech"
    },
    {
      title: "Financial Analyst - Investment Firm",
      description: "Analyze financial data, prepare reports, and provide recommendations for investment strategies. Requires a strong finance background.",
      location: "Blantyre",
      salary: "MWK 1,100,000 - 1,600,000 per month",
      jobType: "Full-time",
      companyName: "Mulanje Investments"
    },
     { title: "Cotton Farm Manager", description: "Oversee operations at a large-scale cotton farm, including planting, harvesting, and labor management.", location: "Salima", salary: "MWK 700,000 - 1,000,000 per month", jobType: "Full-time", companyName: "Central Cotton Growers" },
    { title: "Textile Designer - Local Fabrications", description: "Creative designer needed to develop new textile patterns inspired by Malawian culture for clothing and home goods.", location: "Blantyre", salary: "MWK 450,000 - 650,000 per month", jobType: "Full-time", companyName: "Chitenge Creations" },
    { title: "Water Engineer - Rural Access Project", description: "Design and supervise the construction of boreholes and water supply systems in rural communities.", location: "Mzuzu", salary: "MWK 900,000 - 1,300,000 per month", jobType: "Full-time", companyName: "Malawi Water Initiative" },
    { title: "Forestry Officer - Sustainable Logging", description: "Manage sustainable logging practices and reforestation efforts in designated forest areas.", location: "Dedza", salary: "MWK 600,000 - 850,000 per month", jobType: "Full-time", companyName: "Malawi Timber & Forestry" },
    { title: "Graphic Designer - Marketing Agency", description: "Talented graphic designer to create visual content for various clients, including logos, brochures, and social media graphics.", location: "Lilongwe", salary: "MWK 550,000 - 750,000 per month", jobType: "Full-time", companyName: "Capital City Creatives" },
    { title: "Mining Geologist - Exploration", description: "Join a team exploring for mineral deposits in potential mining areas across Malawi.", location: "Northern Region (various)", salary: "MWK 1,200,000 - 1,800,000 per month", jobType: "Contract", companyName: "Malawi Mineral Prospectors" },
    { title: "Lecturer in Public Health - University", description: "Teach and conduct research in public health, focusing on Malawian health challenges.", location: "Zomba", salary: "MWK 1,000,000 - 1,500,000 per month", jobType: "Full-time", companyName: "University of Malawi" },
    { title: "Supply Chain Coordinator - FMCG", description: "Manage the logistics and distribution of fast-moving consumer goods across the country.", location: "Blantyre", salary: "MWK 750,000 - 1,150,000 per month", jobType: "Full-time", companyName: "Southern Goods Distribution" },
    { title: "Social Worker - Child Protection Services", description: "Work with vulnerable children and families, providing support and ensuring child protection.", location: "Nationwide (various districts)", salary: "MWK 500,000 - 700,000 per month", jobType: "Full-time", companyName: "Malawi Child Services" },
    { title: "IT Security Analyst - Banking Sector", description: "Ensure the security of our banking systems and protect against cyber threats.", location: "Lilongwe", salary: "MWK 1,300,000 - 1,900,000 per month", jobType: "Full-time", companyName: "Malawi National Bank" }
  ];

  console.log("Adding 20 random jobs...");

  for (const jobData of randomJobs) {
    try {
      await createJob(jobData);
      console.log(`Successfully added job: ${jobData.title}`);
    } catch (error) {
      console.error(`Failed to add job: ${jobData.title}`, error);
    }
  }

  console.log("Finished adding random jobs.");
};

// Placeholder functions for user profile and resume management
export const getUserProfile = async (userId: string) => {
  console.log(`Fetching user profile for user ID: ${userId}`);
  // Mock implementation: return a mock user profile
  return {
    id: userId,
    username: 'mockuser',
    email: 'mock@example.com',
    firstName: 'Mock',
    lastName: 'User',
    headline: 'Frontend Developer',
    location: 'Lilongwe, Malawi',
    bio: 'Experienced developer with a passion for building user interfaces.',
  };
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  console.log(`Updating user profile for user ID: ${userId} with data:`, profileData);
  // Mock implementation: return a success message
  return { message: 'User profile updated successfully!' };
};

export const uploadResume = async (userId: string, resumeFile: File) => {
  console.log(`Uploading resume for user ID: ${userId}, file: ${resumeFile.name}`);
  // Mock implementation: return a success message
  return { message: 'Resume uploaded successfully!' };
};

export const getUserResumes = async (userId: string) => {
  console.log(`Fetching resumes for user ID: ${userId}`);
  // Mock implementation: return a list of mock resumes
  return [{ id: 'resume-1', fileName: 'resume_mock.pdf', uploadDate: '2023-10-27' }];
};

export const deleteResume = async (userId: string, resumeId: string) => {
  console.log(`Deleting resume ${resumeId} for user ID: ${userId}`);
  // Mock implementation: return a success message
  return { message: 'Resume deleted successfully!' };
};

// Placeholder functions for admin tasks
export const getAllUsers = async () => {
  console.log('Fetching all users (admin)');
  // Mock implementation: return a list of mock users
  return [
    { id: 'user-1', username: 'user1', email: 'user1@example.com', roles: ['ROLE_USER'] },
    { id: 'employer-1', username: 'employer1', email: 'employer1@example.com', roles: ['ROLE_EMPLOYER'] },
    { id: 'admin-1', username: 'admin1', email: 'admin1@example.com', roles: ['ROLE_ADMIN'] },
  ];
};

export const deleteUser = async (userId: string) => {
  console.log(`Deleting user with ID: ${userId} (admin)`);
  // Mock implementation: return a success message
  return { message: 'User deleted successfully!' };
};

export const getAllCompaniesAdmin = async () => {
  console.log('Fetching all companies (admin)');
  // Mock implementation: return a list of mock companies with verification status
  return [{ id: 'company-1', name: 'Mock Company A', industry: 'Tech', location: 'Lilongwe', isVerified: true }, { id: 'company-2', name: 'Mock Company B', industry: 'Healthcare', location: 'Blantyre', isVerified: false }];
};

export default api;
