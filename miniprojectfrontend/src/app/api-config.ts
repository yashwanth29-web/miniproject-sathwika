export const API_BASE: string = (window as any).__env?.API_BASE || 'http://34.100.200.125:5000';

export function apiPath(path: string) {
  return `${API_BASE}/${path}`.replace(/([^:]\/)\/+/, '$1');
}
