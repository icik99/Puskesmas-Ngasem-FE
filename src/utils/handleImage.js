export default function handleImage(url) {
  return `${process.env.NEXT_PUBLIC_BACKEND_IMAGE}${url}`;
}
