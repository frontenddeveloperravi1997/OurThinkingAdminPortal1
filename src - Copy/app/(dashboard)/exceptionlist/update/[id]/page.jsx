'use client'
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { PageHeading } from '@/widgets';
import { ExceptionSetting } from '@/sub-components';
import { getExceptionDomainById } from '@/app/api/datalist';
import SystemForm from '@/sub-components/dashboard/SystemForm';
import {  toast,ToastContainer } from 'react-toastify';
import DeleteSystem from '@/sub-components/settings/DeleteSystem';
const UpdateException = ({ params }) => {
    const [domain, setDomain] = useState(null);
    const { id: itemId } = params;
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (itemId) {
                    const domainData = await getExceptionDomainById(itemId);
                    if(domainData?.statusCode ===200){
                    
                        setDomain(domainData?.data);
                    }else{
                        toast.error("Oops failed to fetch details")
                    }
                   
                  
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                toast.error("Oops failed to fetch details")
            }
        };

        fetchData();
    }, [itemId]);

    if (!domain) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="p-6">
            
            <PageHeading heading="Exception Domains" />
            <SystemForm pageName={"ExceptionDomain"} isEdit={true} domain={domain}/>
            <DeleteSystem pageName={"ExceptionDomain"} domainId={domain?.domainId} domainName={domain?.domainName}/>
        </Container>
    );
};
export default UpdateException;
