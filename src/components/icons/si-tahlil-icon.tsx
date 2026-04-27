interface Props {
  className?: string;
}

// "Si tahlil" — robot/AI ikoni (figmadagi b logoga yaqin)
export const SiTahlilIcon = ({ className = "w-[18px] h-[18px]" }: Props = {}) => (
  <svg
    className={className}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M3.75 7.5C3.75 6.67157 4.42157 6 5.25 6H12.75C13.5784 6 14.25 6.67157 14.25 7.5V12.75C14.25 13.5784 13.5784 14.25 12.75 14.25H5.25C4.42157 14.25 3.75 13.5784 3.75 12.75V7.5Z"
      stroke="#1A1A1A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 3V6"
      stroke="#1A1A1A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="3" r="0.75" fill="#1A1A1A" />
    <path
      d="M2.25 9.75H3.75M14.25 9.75H15.75"
      stroke="#1A1A1A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="6.75" cy="9.75" r="0.75" fill="#1A1A1A" />
    <circle cx="11.25" cy="9.75" r="0.75" fill="#1A1A1A" />
    <path
      d="M7.125 11.625H10.875"
      stroke="#1A1A1A"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);
