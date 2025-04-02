import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TaskPaginationProps {
  totalPages: number;
  pageNo: number;
  setPageNo: (pageNo: number) => void;
}
export const TaskPagination = ({
  totalPages,
  pageNo,
  setPageNo,
}: TaskPaginationProps) => {
  return (
    <div className="mt-4 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPageNo(Math.max(1, pageNo - 1))}
              aria-disabled={pageNo <= 1}
              tabIndex={pageNo <= 1 ? -1 : undefined}
              className={
                pageNo <= 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setPageNo(page)}
                isActive={pageNo === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPageNo(Math.min(totalPages, pageNo + 1))}
              // disabled={pageNo === totalPages}
              aria-disabled={pageNo === totalPages}
              tabIndex={pageNo === totalPages ? -1 : undefined}
              className={
                pageNo === totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
