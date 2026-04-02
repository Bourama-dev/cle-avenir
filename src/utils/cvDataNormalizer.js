export const normalizeCVData = (inputData = {}) => {
  if (!inputData) return createDefaultData();
  
  return {
    fullName: inputData?.fullName || inputData?.personalInfo?.name || '',
    jobTitle: inputData?.jobTitle || '',
    email: inputData?.email || inputData?.personalInfo?.email || '',
    phone: inputData?.phone || inputData?.personalInfo?.phone || '',
    address: inputData?.address || inputData?.personalInfo?.location || '',
    summary: inputData?.summary || '',
    experience: Array.isArray(inputData?.experience) ? inputData.experience : [],
    education: Array.isArray(inputData?.education) ? inputData.education : [],
    skills: inputData?.skills || '',
    languages: Array.isArray(inputData?.languages) ? inputData.languages : [],
    qualities: Array.isArray(inputData?.qualities) ? inputData.qualities : [],
    fontClass: inputData?.fontClass || 'font-sans',
    colorScheme: inputData?.colorScheme || 'default',
    personalInfo: {
      name: inputData?.fullName || inputData?.personalInfo?.name || '',
      email: inputData?.email || inputData?.personalInfo?.email || '',
      phone: inputData?.phone || inputData?.personalInfo?.phone || '',
      location: inputData?.address || inputData?.personalInfo?.location || ''
    }
  };
};

const createDefaultData = () => ({
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  experience: [],
  education: [],
  skills: '',
  languages: [],
  qualities: [],
  fontClass: 'font-sans',
  colorScheme: 'default',
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: ''
  }
});