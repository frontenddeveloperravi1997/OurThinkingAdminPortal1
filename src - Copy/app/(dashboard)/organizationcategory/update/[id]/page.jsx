'use client';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { PageHeading } from '@/widgets';
import { OrganizationCategorySetting } from '@/sub-components'; // Update or add this if needed
import { getOrganizationCategoryById } from '@/app/api/datalist'; // Update API function
import CategorySystemForm from '@/sub-components/dashboard/CategorySystemForm';
import { toast } from 'react-hot-toast';
import OrganizationCategoryDeleteSystem from '@/sub-components/settings/OrganizationCategoryDeleteSystem'; // Ensure this component handles categories

const UpdateOrganizationCategory = ({ params }) => {
    const [category, setCategory] = useState(null);
    const { id: itemId } = params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (itemId) {
                    const categoryData = await getOrganizationCategoryById(itemId); // Update API call
                    if (categoryData?.statusCode === 200) {
                        setCategory(categoryData?.data);
                    } else {
                        toast.error("Oops, failed to fetch details");
                    }
                }
            } catch (error) {
                console.error('Error fetching details:', error);
                toast.error("Oops, failed to fetch details");
            }
        };
        fetchData();
    }, [itemId]);

    if (!category) {
        //console.log('value of category--',category);
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="p-6">
            <PageHeading heading="Organization Category" /> {/* Updated heading */}
            <CategorySystemForm pageName={"OrganizationCategory"} isEdit={true} category={category} />
            <OrganizationCategoryDeleteSystem pageName={"OrganizationCategory"} organizationCategoryID={category?.organizationCategoryID} categoryName={category?.categoryName} /> 
        </Container>
    );
};

export default UpdateOrganizationCategory;
