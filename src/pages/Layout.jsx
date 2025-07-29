
import React, { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    const pixelId = '269162989026221'; // IMPORTANT: Replace with your actual Pixel ID

    // Prevent duplicate script injection
    if (window.fbq) return;

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
    `;
    document.head.appendChild(script);

    // No-script part for fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
    />`;
    document.head.appendChild(noscript);

    return () => {
      // Clean up script and noscript tags if the layout were to unmount
      document.head.removeChild(script);
      document.head.removeChild(noscript);
    };
  }, []);

  return <>{children}</>;
}
