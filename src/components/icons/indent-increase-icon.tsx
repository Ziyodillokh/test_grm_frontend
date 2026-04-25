interface Props {
  className?: string;
}

export const IndentIncreaseIcon = ({ className = "w-[24px] h-[24px]" }: Props) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M20 6H9M20 12H13M20 18H9M4 8L8 12L4 16"
      stroke="#1A1A1A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
