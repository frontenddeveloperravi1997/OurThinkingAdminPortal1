// app/api/datalist.js
import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export const fetchExceptionList = async (pageNumber, searchTerm) => {
    // Start with the base URL
    let url = `${baseUrl}/api/ExceptionDomain`;
  
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
  

  export const fetchBlacklist = async (pageNumber, searchTerm) => {
    // Start with the base URL
    let url = `${baseUrl}/api/BlackListDomain`;
  
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
  

  export const fetchWhitelist = async (pageNumber, searchTerm) => {
    // Start with the base URL
    let url = `${baseUrl}/api/WhiteListDomain`;
  
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
  
  export const fetchOrganizationCategoryList = async (pageNumber, searchTerm) => {
    // Start with the base URL
    let url = `${baseUrl}/api/Organization/OrganizationCategory`;
  
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


export const addExceptionDomain = async (domain) => {
    const response = await axios.post(`${baseUrl}/api/ExceptionDomain`, domain, {
        headers: {
            'Api_Key': apiKey
        }
    });
    return response;
};

export const addBlacklistDomain = async (domain) => {
    const response = await axios.post(`${baseUrl}/api/BlackListDomain`, domain, {
        headers: {
            'Api_Key': apiKey
        }
    });
    return response;
};

export const addWhitelistDomain = async (domain) => {
    const response = await axios.post(`${baseUrl}/api/WhiteListDomain`, domain, {
        headers: {
            'Api_Key': apiKey
        }
    });
    return response;
};

export const getExceptionDomainById = async (Id) => {
    const response = await axios.get(`${baseUrl}/api/ExceptionDomain/${Id}`, {
        headers: { 'Api_Key': apiKey }
    });
    return response.data;
};

export const getBlackListDomainById = async (Id) => {
    const response = await axios.get(`${baseUrl}/api/BlackListDomain/${Id}`, {
        headers: { 'Api_Key': apiKey }
    });
    return response.data;
};

export const getWhiteListDomainById = async (Id) => {
    const response = await axios.get(`${baseUrl}/api/WhiteListDomain/${Id}`, {
        headers: { 'Api_Key': apiKey }
    });
    return response.data;
};

export const getWhiteList = async (Id) => {
  const response = await axios.get(`${baseUrl}/api/WhiteListDomain`, {
      headers: { 'Api_Key': apiKey }
  });
  return response.data;
};

export const getOrganizationCategoryById = async (Id) => {
  const response = await axios.get(`${baseUrl}/api/Organization/OrganizationCategoryById`, {
      params: { Id },
      headers: { 'Api_Key': apiKey }
  });
  return response.data;
};


export const isWhiteListDomainExists = async (domainName) => {
  const response = await axios.get(`${baseUrl}/api/WhiteListDomain/IsDomainExists`, {
      params: { domainName: domainName },
      headers: { 'Api_Key': apiKey }
  });
  return response.data;
};

export const isBlackListDomainExists = async (domainName) => {
  const response = await axios.get(`${baseUrl}/api/BlackListDomain/IsDomainExists`, {
      params: { domainName: domainName },
      headers: { 'Api_Key': apiKey }
  });
  return response.data;
};

export const isExceptionListDomainExists = async (domainName) => {
  const response = await axios.get(`${baseUrl}/api/ExceptionDomain/IsDomainExists`, {
      params: { domainName: domainName },
      headers: { 'Api_Key': apiKey }
  });
  return response.data;
};

// export const isOrganizationListDomainExists = async (domainName) => {
//   const response = await axios.get(`${baseUrl}/api/Organization/IsDomainExists`, {
//       params: { domainName: domainName },
//       headers: { 'Api_Key': apiKey }
//   });
//   return response.data;
// };