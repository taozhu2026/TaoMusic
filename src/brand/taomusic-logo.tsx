import type { SVGProps } from 'react';

interface TaoMusicMarkProps extends SVGProps<SVGSVGElement> {
  decorative?: boolean;
}

export function TaoMusicMark({
  className,
  decorative = true,
  ...props
}: TaoMusicMarkProps) {
  return (
    <svg
      aria-hidden={decorative}
      className={className}
      fill="none"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="32" cy="32" fill="currentColor" fillOpacity="0.08" r="24" />
      <circle cx="32" cy="32" stroke="currentColor" strokeWidth="2.4" r="18" />
      <circle cx="32" cy="32" fill="currentColor" r="4.2" />
      <path
        d="M14 28.5C18.5 18.5 27 13 36.8 13C44.6 13 50.5 16.1 54.5 21.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
      <path
        d="M48.5 43.6C44.8 48.8 39 52 31.8 52C23.4 52 16.4 47.7 12.4 40.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
      <circle cx="53" cy="22" fill="currentColor" r="2.8" />
      <circle cx="13.4" cy="39.8" fill="currentColor" r="2.3" />
    </svg>
  );
}

interface TaoMusicLockupProps {
  className?: string;
  subtitle?: string;
}

export function TaoMusicLockup({
  className,
  subtitle = 'A small AI music muse for atmosphere and drift.',
}: TaoMusicLockupProps) {
  return (
    <div className={['brandMark', className].filter(Boolean).join(' ')}>
      <span className="brandMarkWrap" aria-hidden="true">
        <TaoMusicMark className="brandMarkSvg" />
      </span>
      <div>
        <p className="brandName">TaoMusic</p>
        <p className="brandTag">{subtitle}</p>
      </div>
    </div>
  );
}
