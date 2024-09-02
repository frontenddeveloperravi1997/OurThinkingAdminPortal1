'use client'
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { PageHeading } from '@/widgets';
import { BlacklistSetting } from '@/sub-components';
import { getBlackListDomainById } from '@/app/api/datalist';
import SystemForm from '@/sub-components/dashboard/SystemForm';
import {toast} from 'react-hot-toast';
import DeleteSystem from '@/sub-components/settings/DeleteSystem';
const UpdateBlackList = ({ params }) => {
    const [domain, setDomain] = useState(null);
    const { id: itemId } = params;
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (itemId) {
                    const domainData = await getBlackListDomainById(itemId);
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
            <PageHeading heading="Blacklist Domains" />
            <SystemForm pageName={"BlackListDomain"} isEdit={true} domain={domain} />
            <DeleteSystem pageName={"BlackListDomain"} domainId={domain?.domainId} domainName={domain?.domainName}/>
        </Container>
    );
};
export default UpdateBlackList;
