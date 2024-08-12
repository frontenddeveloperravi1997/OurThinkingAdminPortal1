'use client';

import { Container } from 'react-bootstrap';
import { PageHeading } from '@/widgets';
import { ExceptionSetting } from '@/sub-components';
import CategorySystemForm from '@/sub-components/dashboard/CategorySystemForm';

const AddOrganizationCategory = () => {

    return (
        <Container fluid className="p-6">
            <PageHeading heading="Organization Category" />
            <CategorySystemForm pageName={"OrganizationCategory"} isEdit={false} />
        </Container>
    );
};

export default AddOrganizationCategory;
