export default function TableImage({ url }: { url: string | null }) {
  return (
    <>
      {url ? (
        <img
          src={import.meta.env.VITE_APP_AWS_PATH + url}
          alt="img"
          className="rounded-lg  w-[56px] aspect-square object-cover"
          width={56}
          height={56}
        />
      ) : (
        ""
      )}
    </>
  );
}
