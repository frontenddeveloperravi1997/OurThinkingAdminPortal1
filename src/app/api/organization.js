import axios from 'axios';

// Set your base URL here
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseDropUrl = process.env.NEXT_PUBLIC_BASE_DROP_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const organizationList = async (pageNumber, searchTerm) => {
  // Start with the base URL
  let url = `${baseUrl}/api/Organization`;

  // Initialize an array to hold query parameters
  let queryParams = [];

  // Add pageNumber to the query parameters if provided
  if (pageNumber) {
    queryParams.push(`pageNumber=${pageNumber}`);
  }

  // Add searchTerm to the query parameters if provided
  if (searchTerm) {
    queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
  }

  // If there are any query parameters, append them to the URL
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Api_Key': apiKey
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
};



const organizationCategoryList = async () => {
  const response = await fetch(`${baseUrl}/api/Organization/OrganizationCategory`, {
    method: 'GET',
    headers: {
      'Api_Key': apiKey
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
};
const organizationKeyContact = async () => {
  const response = await fetch(`${baseDropUrl}/GetKeyContacts`, {
    method: 'GET',
    headers: {
      'Api_Key': apiKey
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
};
const updateOrganization = async (userId, userData) => {
  const response = await axios.put(`${baseUrl}/api/Organization/UpdateOrganization`, userData, {
    headers: { 'Api_Key': apiKey },
    params: { Id: userId }
  });
  return response.data;
};

const organizationById = async (Id) => {
  const response = await axios.get(`${baseUrl}/api/Organization/OrganizationById`, {
    headers: { 'Api_Key': apiKey },
    params: { Id }
  });
  return response.data;
};

const deleteOrganizationById = async (Id) => {
  const response = await axios.delete(`${baseUrl}/api/Organization/${Id}`, {
    headers: { 'Api_Key': apiKey },  
  });
  return response.data;
};




const createOrganization = async (userData) => {
  const response = await axios.post(`${baseUrl}/api/Organization/CreateOrganization`, userData, {
    headers: { 'Api_Key': apiKey }
  });
  return response.data;
};
const getOrgnizationData = async (query) => {
  const response = await fetch(`${baseUrl}/api/Organization?search=${query}`, {
    method: 'GET',
    headers: {
      'Api_Key': apiKey
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
};

export { organizationList, updateOrganization, organizationById, deleteOrganizationById, createOrganization,getOrgnizationData,organizationCategoryList,organizationKeyContact };
