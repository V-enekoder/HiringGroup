import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});


apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


export const authService = {
    login: (credentials) => apiClient.post('/users/login', credentials),
    registerUserAndProfile: (data) =>
         apiClient.post('/users/register', data),
    
};

export const candidateService = {
    updateBankDetails: (candidateId, data) => apiClient.put(`/candidates/${candidateId}/bank`, data),
    updateEmergencyContact: (candidateId, data) => apiClient.put(`/candidates/${candidateId}/emergency`, data),
    updateProfessionalInfo: (candidateId, data) => apiClient.put(`/candidates/${candidateId}/professional`, data),
    getCandidateProfile: (candidateId) => apiClient.get(`/candidates/${candidateId}`),
};

export const companyService = {
    createNewCompany: (data) => apiClient.post('/companies/', data),
    updateCompany: (companyId, data) => apiClient.put(`/companies/${companyId}`, data),
    getAllCompanies: () => apiClient.get('/companies/'),
    deleteCompany: (companyId) => apiClient.delete(`/companies/${companyId}`)
}

export const jobOffersService = {
    getActiveOffers: () => apiClient.get('/joboffers/active')
}

export const postulationService = {
    getAllPostulations: () => apiClient.get('/postulations/')
}

export const bankService = {
    createNewBank: (data) => apiClient.post('/banks/', data),
    updateBank: (bankId, data) => apiClient.put(`/banks/${bankId}`, data),
    getAllBanks: () => apiClient.get('/banks/'),
    deleteBank: (bankId) => apiClient.delete(`/banks/${bankId}`)
}