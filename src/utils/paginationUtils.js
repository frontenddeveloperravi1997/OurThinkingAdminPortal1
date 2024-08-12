// PaginationComponent.js
import { Form, Button } from 'react-bootstrap';
import { useState } from "react";
import ReactPaginate from 'react-paginate';
import { useMediaQuery } from 'react-responsive';

const PaginationUtils = ({ currentPage, totalPages, onPageChange }) => {
    const isMobile = useMediaQuery({
        query: '(max-width: 768px)'
    });

    const [inputPageNumber, setInputPageNumber] = useState('');

    const handleInputChange = (e) => {
        setInputPageNumber(e.target.value);
    };

    const handleInputSubmit = () => {
        const page = parseInt(inputPageNumber, 10);
        if (page > 0 && page <= totalPages) {
            onPageChange(page);
            setInputPageNumber(''); // Clear input after submitting
        }
    };

    const handlePageClick = (event) => {
        onPageChange(event?.selected + 1);
    };

    return (
        <div className='pagination-container'>
            <ReactPaginate
                nextLabel={isMobile ? ">" : "Next >"}
                onPageChange={handlePageClick}
                pageRangeDisplayed={isMobile ? 1 : 3}
                marginPagesDisplayed={isMobile ? 1 : 2}
                pageCount={totalPages}
                previousLabel={isMobile ? "<" : "< Previous"}
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
                forcePage={currentPage - 1} // Ensure correct page is highlighted
            />

            <div className="mt-3 mb-4 d-flex justify-content-center">
                <Form.Control
                    type="number"
                    placeholder="Go to page"
                    value={inputPageNumber}
                    onChange={handleInputChange}
                    style={{ width: '140px', marginRight: '10px' }}
                />
                <Button onClick={handleInputSubmit}>Go</Button>
            </div>
        </div>
    );
};

export default PaginationUtils;
