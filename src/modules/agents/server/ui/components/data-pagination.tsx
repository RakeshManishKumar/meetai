import { Button } from "@/components/ui/button";
interface DataPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}


export const DataPagination = ({page,totalPages,onPageChange}:DataPaginationProps) => {
    return (
        <div className="flex items-center justify-between">
           <div className="flex-1 text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
           </div>
           <div className="flex items-center justify-end gap-x-2 py-4">
            <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(1,page - 1))}
            size="sm"
            >
                Previous
            </Button>
            <Button
            variant="outline"
            disabled={page === totalPages || !totalPages}
            onClick={() => onPageChange(Math.min(totalPages,page + 1))}
            size="sm"
            >
                Next
            </Button>
           </div>
        </div>
    )
}