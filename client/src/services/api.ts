import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ========== Projects ==========
  getProjects(page?: number, limit?: number) {
    return this.client.get('/projects', { params: { page, limit } });
  }

  getProject(id: string) {
    return this.client.get(`/projects/${id}`);
  }

  createProject(data: any) {
    return this.client.post('/projects', data);
  }

  updateProject(id: string, data: any) {
    return this.client.put(`/projects/${id}`, data);
  }

  deleteProject(id: string) {
    return this.client.delete(`/projects/${id}`);
  }

  // ========== Tasks ==========
  getTasks(projectId?: string) {
    return this.client.get('/tasks', { params: { projectId } });
  }

  getTask(id: string) {
    return this.client.get(`/tasks/${id}`);
  }

  createTask(data: any) {
    return this.client.post('/tasks', data);
  }

  updateTask(id: string, data: any) {
    return this.client.put(`/tasks/${id}`, data);
  }

  completeTask(id: string) {
    return this.client.patch(`/tasks/${id}/complete`, {});
  }

  // ========== Customers ==========
  getCustomers(page?: number) {
    return this.client.get('/customers', { params: { page } });
  }

  getCustomer(id: string) {
    return this.client.get(`/customers/${id}`);
  }

  createCustomer(data: any) {
    return this.client.post('/customers', data);
  }

  updateCustomer(id: string, data: any) {
    return this.client.put(`/customers/${id}`, data);
  }

  // ========== Invoices ==========
  getInvoices(projectId?: string) {
    return this.client.get('/invoices', { params: { projectId } });
  }

  getInvoice(id: string) {
    return this.client.get(`/invoices/${id}`);
  }

  createInvoice(data: any) {
    return this.client.post('/invoices', data);
  }

  updateInvoice(id: string, data: any) {
    return this.client.put(`/invoices/${id}`, data);
  }

  // ========== AI Services ==========
  getDailyBrief() {
    return this.client.get('/ai/daily-brief');
  }

  getEveningReport() {
    return this.client.get('/ai/evening-report');
  }

  chatWithAI(message: string) {
    return this.client.post('/ai/chat', { message });
  }

  // ========== Automation ==========
  getAutomationConfig() {
    return this.client.get('/automation/config');
  }

  updateAutomationConfig(data: any) {
    return this.client.post('/automation/config', data);
  }

  triggerAutomation(ruleName: string) {
    return this.client.post('/automation/trigger', { rule: ruleName });
  }

  // ========== Vendors ==========
  getVendors(page?: number) {
    return this.client.get('/vendors', { params: { page } });
  }

  getVendor(id: string) {
    return this.client.get(`/vendors/${id}`);
  }

  createVendor(data: any) {
    return this.client.post('/vendors', data);
  }

  updateVendor(id: string, data: any) {
    return this.client.put(`/vendors/${id}`, data);
  }

  // ========== Staff ==========
  getStaff(page?: number) {
    return this.client.get('/staff', { params: { page } });
  }

  getStaffMember(id: string) {
    return this.client.get(`/staff/${id}`);
  }

  createStaffMember(data: any) {
    return this.client.post('/staff', data);
  }

  updateStaffMember(id: string, data: any) {
    return this.client.put(`/staff/${id}`, data);
  }
}

export const apiClient = new APIClient();