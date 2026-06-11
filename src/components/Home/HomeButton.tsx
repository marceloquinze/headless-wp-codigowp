interface HomeButtonProps {
  link: string;
  label: string;
}

export default function HomeButton({ link, label }: HomeButtonProps) {
  return (
    <a
      href={link}
      rel="noopener noreferrer"
      className="flex self-center bg-primary-rgb hover:bg-gray-900 hover:text-quaternary text-white py-4 px-4 uppercase text-base text-center size-fit transition ease-in-out duration-300 "
    >
      {label}
    </a>
  );
}
