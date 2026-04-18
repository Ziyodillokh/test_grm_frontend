type IconProps = { size?: number };

export function DeviceAnalyticsIcon({ size = 20 }: IconProps = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.25 15H12.75M6.75 12V15M11.25 12V15M6 9L8.25 6.75L9.75 8.25L12 6M3 3H15C15.4142 3 15.75 3.33579 15.75 3.75V11.25C15.75 11.6642 15.4142 12 15 12H3C2.58579 12 2.25 11.6642 2.25 11.25V3.75C2.25 3.33579 2.58579 3 3 3Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function FileTextIcon({ size = 20 }: IconProps = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.33366 1.33398H4.00033C3.6467 1.33398 3.30756 1.47446 3.05752 1.72451C2.80747 1.97456 2.66699 2.3137 2.66699 2.66732V13.334C2.66699 13.6876 2.80747 14.0267 3.05752 14.2768C3.30756 14.5268 3.6467 14.6673 4.00033 14.6673H12.0003C12.3539 14.6673 12.6931 14.5268 12.9431 14.2768C13.1932 14.0267 13.3337 13.6876 13.3337 13.334V5.33398L9.33366 1.33398Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.6663 11.334H5.33301" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.6663 8.66602H5.33301" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66634 6H5.99967H5.33301" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.33301 1.33398V5.33398H13.333" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function RefreshCcwIcon({ size = 20 }: IconProps = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_refresh)">
        <path d="M15.333 13.334V9.33398H11.333" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.666992 2.66602V6.66602H4.66699" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.6603 6.00038C13.3222 5.0449 12.7476 4.19064 11.99 3.51732C11.2325 2.844 10.3167 2.37355 9.32813 2.14988C8.33959 1.92621 7.31049 1.9566 6.33687 2.23823C5.36324 2.51985 4.47682 3.04352 3.76033 3.76038L0.666992 6.66704M15.3337 9.33371L12.2403 12.2404C11.5238 12.9572 10.6374 13.4809 9.66379 13.7625C8.69016 14.0441 7.66106 14.0745 6.67252 13.8509C5.68397 13.6272 4.76819 13.1568 4.01064 12.4834C3.25308 11.8101 2.67844 10.9559 2.34033 10.0004" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip_refresh">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function ShoppingCartIcon({ size = 20 }: IconProps = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_cart)">
        <path d="M13.3337 14.6673C13.7018 14.6673 14.0003 14.3688 14.0003 14.0007C14.0003 13.6325 13.7018 13.334 13.3337 13.334C12.9655 13.334 12.667 13.6325 12.667 14.0007C12.667 14.3688 12.9655 14.6673 13.3337 14.6673Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.99967 14.6673C6.36786 14.6673 6.66634 14.3688 6.66634 14.0007C6.66634 13.6325 6.36786 13.334 5.99967 13.334C5.63148 13.334 5.33301 13.6325 5.33301 14.0007C5.33301 14.3688 5.63148 14.6673 5.99967 14.6673Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.666992 0.666016H3.33366L5.12033 9.59268C5.18129 9.89961 5.34826 10.1753 5.59202 10.3715C5.83578 10.5678 6.14079 10.672 6.45366 10.666H12.9337C13.2465 10.672 13.5515 10.5678 13.7953 10.3715C14.0391 10.1753 14.206 9.89961 14.267 9.59268L15.3337 3.99935H4.00033" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip_cart">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function TagIcon({ size = 20 }: IconProps = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.7263 8.94065L8.94634 13.7207C8.82251 13.8446 8.67546 13.943 8.51359 14.0101C8.35173 14.0772 8.17823 14.1117 8.00301 14.1117C7.82779 14.1117 7.65428 14.0772 7.49242 14.0101C7.33056 13.943 7.1835 13.8446 7.05967 13.7207L1.33301 8.00065V1.33398H7.99967L13.7263 7.06065C13.9747 7.31047 14.1141 7.6484 14.1141 8.00065C14.1141 8.3529 13.9747 8.69083 13.7263 8.94065V8.94065Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.66699 4.66602H4.67366" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function UsersIcon({ size = 20 }: IconProps = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_users)">
        <path d="M15.333 13.9993V12.6659C15.3326 12.0751 15.1359 11.5011 14.7739 11.0341C14.4119 10.5672 13.9051 10.2336 13.333 10.0859" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.3337 14V12.6667C11.3337 11.9594 11.0527 11.2811 10.5526 10.781C10.0525 10.281 9.37424 10 8.66699 10H3.33366C2.62641 10 1.94814 10.281 1.44804 10.781C0.947944 11.2811 0.666992 11.9594 0.666992 12.6667V14" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.667 2.08594C11.2406 2.2328 11.749 2.5664 12.1121 3.03414C12.4752 3.50188 12.6722 4.07716 12.6722 4.66927C12.6722 5.26138 12.4752 5.83666 12.1121 6.3044C11.749 6.77214 11.2406 7.10574 10.667 7.2526" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.99967 7.33333C7.47243 7.33333 8.66634 6.13943 8.66634 4.66667C8.66634 3.19391 7.47243 2 5.99967 2C4.52692 2 3.33301 3.19391 3.33301 4.66667C3.33301 6.13943 4.52692 7.33333 5.99967 7.33333Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip_users">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function BooksIcon({ size = 20 }: IconProps = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.99967 3.33304C5.99967 2.96485 5.7012 2.66637 5.33301 2.66637H3.99967C3.63148 2.66637 3.33301 2.96485 3.33301 3.33304V12.6664C3.33301 13.0346 3.63148 13.333 3.99967 13.333H5.33301C5.7012 13.333 5.99967 13.0346 5.99967 12.6664M5.99967 3.33304V12.6664M5.99967 3.33304C5.99967 2.96485 6.29815 2.66637 6.66634 2.66637H7.99967C8.36786 2.66637 8.66634 2.96485 8.66634 3.33304V12.6664C8.66634 13.0346 8.36786 13.333 7.99967 13.333H6.66634C6.29815 13.333 5.99967 13.0346 5.99967 12.6664M3.33301 5.33304H5.99967M5.99967 10.6664H8.66634M9.33301 5.9997L11.9997 5.33304M10.6663 10.6664L13.2817 10.013M9.20167 3.0397L10.6577 2.68637C11.0323 2.59637 11.413 2.81304 11.5123 3.17437L13.9757 12.1197C14.0191 12.2835 13.9999 12.4576 13.9217 12.6079C13.8435 12.7582 13.712 12.8739 13.553 12.9324L13.4643 12.9597L12.0083 13.313C11.6337 13.403 11.253 13.1864 11.1537 12.825L8.69034 3.8797C8.64688 3.71594 8.66613 3.54184 8.74431 3.39152C8.82249 3.24121 8.95397 3.12549 9.11301 3.06704L9.20167 3.0397Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PieChartIcon({ size = 20 }: IconProps = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_pie)">
        <path d="M14.1399 10.5934C13.7158 11.5964 13.0525 12.4802 12.2079 13.1676C11.3633 13.855 10.3631 14.325 9.2949 14.5366C8.22668 14.7481 7.12289 14.6948 6.08004 14.3813C5.03719 14.0677 4.08703 13.5034 3.31262 12.7378C2.53822 11.9722 1.96315 11.0286 1.6377 9.98935C1.31225 8.95015 1.24632 7.84704 1.44568 6.77647C1.64503 5.70591 2.10361 4.70047 2.78131 3.84807C3.45901 2.99567 4.3352 2.32226 5.33328 1.88672" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14.6667 8.00065C14.6667 7.12517 14.4942 6.25826 14.1592 5.44943C13.8242 4.64059 13.3331 3.90566 12.714 3.28661C12.095 2.66755 11.3601 2.17649 10.5512 1.84145C9.74239 1.50642 8.87548 1.33398 8 1.33398V8.00065H14.6667Z" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip_pie">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
