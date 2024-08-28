import axios from "axios";
import { saveAs } from "file-saver";
// Set your base URL here
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseDropUrl = process.env.NEXT_PUBLIC_BASE_DROP_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const getUsersList = async (pageNumber, searchTerm) => {
  // Start with the base URL
  let url = `${baseUrl}/api/User`;

  // Initialize an array to hold query parameters
  let queryParams = [];

  // Add pageNumber to the query parameters if provided
  if (pageNumber) {
    queryParams.push(`pageNumber=${pageNumber}`);
  }

  // Add searchTerm to the query parameters if provided
  if (searchTerm) {
    queryParams.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
  }

  // If there are any query parameters, append them to the URL
  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Api_Key: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

const updateUser = async (userId, userData) => {
  const response = await axios.put(`${baseUrl}/api/User`, userData, {
    headers: { Api_Key: apiKey },
    params: { Id: userId },
  });
  return response.data;
};

const getFrequencyList = async () => {
  const response = await axios.get(`${baseUrl}/api/User/GetFrequency`, {
    headers: { Api_Key: apiKey },
  });
  return response.data;
};

const getFrequencyById = async (id) => {
  const response = await axios.get(`${baseUrl}/api/User/GetFrequencyById`, {
    headers: { Api_Key: apiKey },
    data: JSON.stringify(id),
  });
  return response.data;
};

const getUserById = async (Id) => {
  const response = await axios.get(`${baseUrl}/api/User/GetUsersById`, {
    headers: { Api_Key: apiKey },
    params: { Id },
  });
  return response.data;
};

const deleteUserById = async (Id) => {
  //const response = await axios.delete(`${baseUrl}/api/User/DeleteMultiUser`, {
    const response = await axios.delete(`${baseUrl}/api/User/${Id}`, { 
    headers: { Api_Key: apiKey },
  });
  return response.data;
};
const deleteMultipleUserById = async (Ids) => {
  const response = await axios.delete(`${baseUrl}/api/User/${Id}`,Ids, {
    headers: { Api_Key: apiKey },
  });
  return response.data;
};
const createUser = async (userData) => {
  const response = await axios.post(`${baseUrl}/api/User`, userData, {
    headers: { Api_Key: apiKey },
  });
  return response.data;
};

const getDropdownData = async () => {
  const response = await fetch(`${baseDropUrl}/getDropdownData`, {
    method: "GET",
    headers: {
      Api_Key: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

const getEADDropdownData = async () => {
  const response = await fetch(`${baseDropUrl}/getEAPDropDownData`, {
    method: "GET",
    headers: {
      Api_Key: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};
const getComparativeData = async () => {
  const response = await fetch(`${baseUrl}/api/User/CompartiveGuides`, {
    method: "GET",
    headers: {
      Api_Key: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

const commonQuery = async (method, query, data, params = {}) => {
  try {
    const response = await axios({
      method: method,
      url: `${baseUrl}${query}`,
      headers: {
        Api_Key: apiKey,
      },
      params: params,

      data: data,
    });
    return response;
  } catch (error) {
    return error;
  }
};

const getRolesData = async () => {
  const response = await fetch(`${baseUrl}/api/Roles`, {
    method: "GET",
    headers: {
      Api_Key: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

const getWhiteListedDomain = async (domain) => {
  const response = await fetch(`${baseUrl}/api/Organization/IsDomainExistsInOrgnizationWhiteList?domainName=${domain}`, {
    method: "GET",
    headers: {
      Api_Key: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};


const updateUserRole = async (payload) => {
  const response = await fetch(`${baseUrl}/api/User/AddMultiRoleToMultiUser`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Api_Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};


const updateUserAddToGroup = async (payload) => {
  const response = await fetch(`${baseUrl}/api/User/AddOrChangeOrganizationToUser`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Api_Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};



const exportAllUsers = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/Reports/ExportAllUsers`, {
      method: "GET",
      headers: {
        // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Api_Key: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    // Generate a unique filename with the current date and time
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `userReport_${timestamp}.xlsx`;
    saveAs(blob, filename);
  } catch (error) {
    console.error("There was an error!", error);
  }
};
const exportAllDomains = async (domainName) => {
  try {
    const response = await fetch(`${baseUrl}/api/Reports/${domainName}`, {
      method: "GET",
      headers: {
        // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Api_Key: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    // Generate a unique filename with the current date and time
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${domainName}${timestamp}.xlsx`;
    saveAs(blob, filename);
  } catch (error) {
    console.error("There was an error!", error);
  }
};
const exportAllOrgReport = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/Reports/ExportOrganizations`, {
      method: "GET",
      headers: {
        // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Api_Key: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    // Generate a unique filename with the current date and time
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `orgReport_${timestamp}.xlsx`;
    saveAs(blob, filename);
  } catch (error) {
    console.error("There was an error!", error);
  }
};
const exportAllOrgAuditReport = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/Reports/OrganizationUserAudit`, {
      method: "GET",
      headers: {
        // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Api_Key: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    // Generate a unique filename with the current date and time
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `orgAuditReport_${timestamp}.xlsx`;
    saveAs(blob, filename);
  } catch (error) {
    console.error("There was an error!", error);
  }
};
const exportAllContentReport = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/Reports/ContentReport`, {
      method: "GET",
      headers: {
        // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Api_Key: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    // Generate a unique filename with the current date and time
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `content_${timestamp}.xlsx`;
    saveAs(blob, filename);
  } catch (error) {
    console.error("There was an error!", error);
  }
};

const uploadBulkSheet = async (formData) => {
  const response = await fetch(`${baseUrl}/api/Reports/UploadUsers`, {
    method: "POST",
    headers: {
      Api_Key: apiKey,
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};


const bulkTagging = async (formData) => {
  try {
    const response = await fetch(`${baseUrl}/api/User/TagTopics`, {
      method: "PUT",
      headers: {
        Api_Key: apiKey,
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during bulk tagging:", error);
    throw error;
  }
};



export {
  getUsersList,
  updateUserRole,
  updateUserAddToGroup,
  bulkTagging,
  updateUser,
  getFrequencyList,
  getFrequencyById,
  getUserById,
  createUser,
  deleteUserById,
  getDropdownData,
  getEADDropdownData,
  getWhiteListedDomain,
  commonQuery,
  getRolesData,
  exportAllUsers,
  exportAllOrgReport,
  exportAllOrgAuditReport,
  exportAllContentReport,
  uploadBulkSheet,
  getComparativeData,
  exportAllDomains,
  deleteMultipleUserById
};
