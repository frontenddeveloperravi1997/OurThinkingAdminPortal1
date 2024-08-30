export const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }
  
  const date = new Date(dateString);
  
  const year = date.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

export const productPermissionsArr =[
  {
    "CG_Cross-border real estate map: investors and occupiers":false,
    "CG_Regulatory Heatmap for Retail Banking and Fintech":false
  }
]
