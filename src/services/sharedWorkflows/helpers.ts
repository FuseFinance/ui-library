export const getFetcherAuth = ({ url, accessToken }: { url: string; accessToken: string }) => {
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json());
};
