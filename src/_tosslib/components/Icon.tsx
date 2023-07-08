import { HTMLAttributes, useEffect, useState } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: 'icon-arrow-back-android-mono';
  size: number;
  color: string;
}
export function Icon({ name, size = 16, color, ...props }: Props) {
  const [iconHTML, setIconHTML] = useState<string | null>(null);

  useEffect(() => {
    fetchIcon(name, { baseUrl: 'https://static.toss.im/icons/svg' })
      .then(iconHTML => {
        setIconHTML(iconHTML);
      })
      .catch(error => {
        console.error(error);
      });
  }, [name]);

  return (
    <span
      css={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        '& svg, path': {
          fill: color,
        },
      }}
      dangerouslySetInnerHTML={
        iconHTML != null
          ? {
              __html: iconHTML,
            }
          : undefined
      }
      {...props}
    />
  );
}

const iconFetchRequests: Record<string, Promise<string>> = {};
function fetchIcon(name: string, { baseUrl }: { baseUrl: string }) {
  if (iconFetchRequests[name] !== undefined) {
    return iconFetchRequests[name];
  }

  const request = new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${baseUrl}/${name}.svg`);
    xhr.send();

    xhr.addEventListener('load', () => {
      if (xhr.status !== 200) {
        return reject(xhr.responseText);
      }

      resolve(xhr.response);
    });
  });

  iconFetchRequests[name] = request;

  return request;
}
