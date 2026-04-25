interface Props {
  className?: string;
}

export const ArrowUpRedIcon = ({ className = "w-[18px] h-[18px]" }: Props) => (
  <svg
    className={className}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M9 3.75V14.25M9 3.75L13.5 8.25M9 3.75L4.5 8.25"
      stroke="#FF553E"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
