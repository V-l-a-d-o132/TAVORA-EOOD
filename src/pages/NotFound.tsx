import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => { document.title = 'Страницата не е намерена | TAVORA'; }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white text-[#0A2540]">
      <p aria-hidden="true" className="text-8xl font-light text-[#0A2540]/15">404</p>
      <h1 className="text-2xl font-semibold mt-6">Страницата не е намерена</h1>
      <p className="mt-3 text-base text-gray-600 max-w-md">Адресът може да е променен. От началната страница можете да намерите услугите, статиите и академията.</p>
      <Link to="/" className="mt-6 px-6 py-3 rounded-full bg-[#0A2540] text-white">Към началната страница</Link>
    </main>
  );
}
