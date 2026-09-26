import type { Category } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FilterFields } from "./FilterControls";
import type { BrowseFilters } from "./filters";

export function FilterDrawer({
  open,
  filters,
  categories,
  onClose,
  onApply,
  lockCategory,
}: {
  open: boolean;
  filters: BrowseFilters;
  categories: Category[];
  onClose: () => void;
  onApply: (filters: BrowseFilters) => void;
  lockCategory?: boolean;
}) {
  return (
    <Modal open={open} title="Filters" onClose={onClose}>
      <FilterFields filters={filters} categories={categories} onChange={onApply} lockCategory={lockCategory} />
      <Button className="mt-5 w-full" onClick={onClose}>
        Show results
      </Button>
    </Modal>
  );
}
