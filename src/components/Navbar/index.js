import React, { useEffect, useState } from 'react';

export default function Navbar({ tittlePage, subTittlePage }) {
  const [storedValue, setStoredValue] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const valueRole = localStorage.getItem('ROLE-PUSKESMAS-NGASEM');
      const valueName = localStorage.getItem('NAME-PUSKESMAS-NGASEM');
  
      setStoredValue({
        role: valueRole,
        name: valueName
      });
    }
  }, []);

  return (
    <div className="md:flex items-center justify-between py-5 px-2 rounded-lg md:mb-[20px]">
      <div>
        <h1 className="text-3xl font-bold text-blue-700 md:mb-0 mb-3">
          {tittlePage}
        </h1>
        {subTittlePage && (
          <h2 className="text-xl font-semibold text-slate-500">
            {subTittlePage}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-[11px]">
        <h1 className="font-semibold text-blue-700">Hi, {storedValue?.role} {storedValue?.name}</h1>
      </div>
    </div>
  );
}
