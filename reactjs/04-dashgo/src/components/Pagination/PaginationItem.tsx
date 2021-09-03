import { Button } from "@chakra-ui/react";
interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}
export function PaginationItem({
  isCurrent = false,
  number,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        fontSize="xs"
        width="4"
        size="sm"
        colorScheme="pink"
        disabled
        _disable={{ bgColor: "pink.500", cursor: "default" }}
      >
        {number}
      </Button>
    );
  }
  return (
    <Button
      fontSize="xs"
      width="4"
      size="sm"
      bgColor="gray.700"
      _hover={{ bgColor: "gray.500" }}
      onClick={() => onPageChange(number)}
    >
      {number}
    </Button>
  );
}
