export function addParams(url = '?', query = {}) {
  url += '?';
  for (const key in query) {
    if (query[key]) {
      url += `${key}=${JSON.stringify(query[key])}&`;
    }
  }
  return url;
}
