// import { useState, useEffect } from 'react';
// import DataList from './DataList';
// import SystemForm from './SystemForm';

// const DataListWrapper = ({ fetchData }) => {
//     const [data, setData] = useState([]);
//     const [domainNames, setDomainNames] = useState([]);
//     const [displayedDomainName, setDisplayedDomainName] = useState(''); // New state for displaying domain name

//     useEffect(() => {
//         const fetchDataAndSetState = async () => {
//             const response = await fetchData();
//             if (response?.statusCode === 200) {
//                 const fetchedData = response.data.data || [];
             
//                 setData(fetchedData);
                
//                 // Log fetchedData for debugging
//                 console.log('Fetched Data:', fetchedData);
    
//                 const domainNamesFromData = fetchedData
//                     .map(item => {
//                         const domainNameText = item.domainName; // Store domainName in a variable
//                         console.log('Item domainName:', domainNameText);
//                         setDisplayedDomainName(domainNameText); // Update displayedDomainName with the current domainName
//                         return domainNameText;
//                     })
//                     .filter(name => name !== undefined && name !== null);
                
//                 setDomainNames(domainNamesFromData);
//                 // console.log('domainNamesFromData DataListWrapper --', domainNamesFromData);
//             }
//         };
    
//        fetchDataAndSetState();
//     }, [fetchData]);
    

//     return (
//         <div>
//             {/* Display the last domainName */}
//             <p>Displayed Domain Name: {displayedDomainName}</p>
//             {/* <DataList data={data} /> */}
//             <SystemForm isEdit={false} domainNamesFromData={domainNames} />
//         </div>
//     );
// };

// export default DataListWrapper;
