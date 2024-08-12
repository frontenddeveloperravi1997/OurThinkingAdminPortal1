'use client'
import { Container } from 'react-bootstrap';
import { PageHeading } from '@/widgets';
import { ExceptionSetting } from '@/sub-components';
import SystemForm from '@/sub-components/dashboard/SystemForm';

const AddExceptionDomain = () => {

    return (
        <Container fluid className="p-6">
            <PageHeading heading="Exception Domains" />
           <SystemForm pageName={"ExceptionDomain"} isEdit={false}/>
        </Container>
    );
};
export default AddExceptionDomain;
