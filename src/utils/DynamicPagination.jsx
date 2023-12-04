import React from 'react'
import { Pagination } from 'react-bootstrap';

const pagination = (currentPage, pageCount) => {
  let delta = 2,
    left = currentPage - delta,
    right = currentPage + delta + 1,
    result = [];
    result = Array.from({ length: pageCount }, (v, k) => k + 1)
      .filter(i => i && i >= left && i < right);
    return result;
}
const handleprevNextPagination = (action, paginate, handlePagination) => {
  let { page, limit, total } = paginate;
  const pages = Math.ceil(total / limit);
if(action === 'prev'){
  if(page > 1){
    --page;
    handlePagination(page);
  }
}else if(action === 'next'){
  if(page < pages){
    ++page;
    handlePagination(page);
    }
  }
}

const DynamicPagination = ({ paginate, handlePagination }) => {
  const { page, limit, total } = paginate;
  const pages = Math.ceil(total / limit);
  return (
    <>
      <div className="pagination-title text-muted fs-14 fs-w500 mt-3">
        Showing {page * limit - limit + 1} to {(page * limit) < total ? (page * limit) : total} of {total} entries
      </div>
      <Pagination className="table-pagination mt-3 ms-auto" size="sm">
        <Pagination.Prev className="fs-14 fs-w500" onClick={() => handleprevNextPagination("prev" ,paginate, handlePagination)}>Previous</Pagination.Prev>
        {pagination(page, pages).map(i => (
          <Pagination.Item key={i} active={i === page} onClick={() => handlePagination(i)} className='fs-14 fs-w500' >
            {i}
          </Pagination.Item>
        ))}
        <Pagination.Next className="fs-14 fs-w500" onClick={() => handleprevNextPagination("next", paginate, handlePagination)}>Next</Pagination.Next>
      </Pagination>
    </>
  );
}

export default DynamicPagination
