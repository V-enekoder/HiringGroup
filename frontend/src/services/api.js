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
    updatePersonalInfo: (candidateId, data) => apiClient.put(`/candidates/${candidateId}`, data),
    getCandidateProfile: (candidateId) => apiClient.get(`/candidates/${candidateId}`),
};

export const companyService = {
    createNewCompany: (data) => apiClient.post('/companies/', data),
    updateCompany: (companyId, data) => apiClient.put(`/companies/${companyId}`, data),
    getAllCompanies: () => apiClient.get('/companies/'),
    deleteCompany: (companyId) => apiClient.delete(`/companies/${companyId}`)
}

export const jobOffersService = {
    createNewOffer: (data) => apiClient.post('/joboffers/', data),
    updateJobOffer: (offerId, data) => apiClient.put(`/joboffers/${offerId}`, data),
    getActiveOffers: () => apiClient.get('/joboffers/active'),
    getOffersbyCompany: (companyId) => apiClient.get(`/joboffers/company/${companyId}`),
    deleteJobOffer: (offerId) => apiClient.delete(`/joboffers/${offerId}`)
}

export const postulationService = {
    creaneNewPostulation: (data) => apiClient.post('/postulations/', data),
    getAllPostulations: () => apiClient.get('/postulations/'),
    getPostulationsByJobOffer: (jobOfferId) => apiClient.get(`/postulations/joboffer/${jobOfferId}`),
    getPostulationsByCandidate: (candidateId) => apiClient.get(`/postulations/candidate/${candidateId}`)
}

export const bankService = {
    createNewBank: (data) => apiClient.post('/banks/', data),
    updateBank: (bankId, data) => apiClient.put(`/banks/${bankId}`, data),
    getAllBanks: () => apiClient.get('/banks/'),
    deleteBank: (bankId) => apiClient.delete(`/banks/${bankId}`)
}

export const professionService = {
    getAllProfessions: () => apiClient.get('/professions/')
}

export const zoneService = {
    getAllZones: () => apiClient.get('/zones/')
}

export const curriculumService = {
    getCurriculumByCandidateId: (candidateId) => apiClient.get(`/curriculums/candidate/${candidateId}`),
    updateCurriculumInfo: (curriculumId, data) => apiClient.put(`/curriculums/${curriculumId}`, data)
}

export const contractService = {
    createNewContract: (data) => apiClient.post('/contracts/', data)
}

export const contractingPeriodService = {
    getAllContractingPeriods: () => apiClient.get('/contracting-periods/')
}

export const emergencyContactService = {
    getEmergencyContactbyCandidateId: (candidateId) => apiClient.get(`/emergency-contacts/${candidateId}`)
}

export const laboralExperienceService = {
    createNewLaboralExperience: (data) => apiClient.post('/laboral-experiences/', data),
    updateLaboralExperience: (laboralExperienceId, data) => apiClient.put(`/laboral-experiences/${laboralExperienceId}`, data),
    deleteLaboralExperience: (laboralExperienceId) => apiClient.delete(`/laboral-experiences/${laboralExperienceId}`)
}