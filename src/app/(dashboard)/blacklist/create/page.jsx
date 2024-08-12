'use client'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { PageHeading } from '@/widgets';
import { GeneralOrgSetting } from '@/sub-components';
import SystemForm from '@/sub-components/dashboard/SystemForm';

const AddBlacklistDomain = () => {

    return (
        <Container fluid className="p-6">
            <PageHeading heading="Black List Domains" />
         <SystemForm pageName={"BlackListDomain"} isEdit={false}/>
        </Container>
    );
};

export default AddBlacklistDomain;
