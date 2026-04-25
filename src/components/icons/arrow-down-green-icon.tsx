interface Props {
  className?: string;
}

export const ArrowDownGreenIcon = ({ className = "w-[18px] h-[18px]" }: Props) => (
  <svg
    className={className}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M9 3.75V14.25M9 14.25L13.5 9.75M9 14.25L4.5 9.75"
      stroke="#3ABC49"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
