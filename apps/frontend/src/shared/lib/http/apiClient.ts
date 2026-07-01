const DEFAULT_API_URL = 'http://localhost:3000';
const REFRESH_PATH = '/auth/refresh';

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;
type JsonBody = Record<string, unknown> | unknown[];
type RequestBody = BodyInit | JsonBody | null;

export type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  auth?: boolean;
  body?: RequestBody;
  headers?: HeadersInit;
  query?: QueryParams;
  retryOnUnauthorized?: boolean;
};

type RefreshResponse = {
  accessToken: string;
};

export class ApiError<TData = unknown> extends Error {
  readonly status: number;
  readonly data: TData | null;
  readonly response: Response;

  constructor(response: Response, data: TData | null) {
    super(`API request failed with status ${response.status}`);
    this.name = 'ApiError';
    this.status = response.status;
    this.data = data;
    this.response = response;
  }
}

let accessToken: string | null = null;
let refreshRequest: Promise<string> | null = null;

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/$/, '');
}

function isJsonBody(body: RequestBody): body is JsonBody {
  return (
    body !== null &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(body) &&
    !(body instanceof URLSearchParams)
  );
}

function createUrl(path: string, query?: QueryParams) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${getApiBaseUrl()}${normalizedPath}`);

  if (!query) {
    return url.toString();
  }

  Object.entries(query).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];

    values.forEach((item) => {
      if (item !== null && item !== undefined) {
        url.searchParams.append(key, String(item));
      }
    });
  });

  return url.toString();
}

function createRequestInit(options: ApiRequestOptions = {}) {
  const { auth = true, body, headers } = options;
  const requestHeaders = new Headers(headers);

  if (auth && accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const requestInit: RequestInit = {
    cache: options.cache,
    credentials: 'include',
    integrity: options.integrity,
    keepalive: options.keepalive,
    method: options.method,
    mode: options.mode,
    redirect: options.redirect,
    referrer: options.referrer,
    referrerPolicy: options.referrerPolicy,
    signal: options.signal,
    headers: requestHeaders,
  };

  if (body !== undefined && body !== null) {
    if (isJsonBody(body)) {
      requestHeaders.set('Content-Type', requestHeaders.get('Content-Type') ?? 'application/json');
      requestInit.body = JSON.stringify(body);
    } else {
      requestInit.body = body;
    }
  }

  return requestInit;
}

async function readResponseBody(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (text.length === 0) {
    return null;
  }

  const contentType = response.headers.get('Content-Type') ?? '';

  if (contentType.includes('application/json')) {
    return JSON.parse(text) as unknown;
  }

  return text;
}

async function requestRaw<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(createUrl(path, options.query), createRequestInit(options));
  const data = await readResponseBody(response);

  if (!response.ok) {
    throw new ApiError(response, data);
  }

  return data as TResponse;
}

async function refreshAccessToken() {
  refreshRequest ??= requestRaw<RefreshResponse>(REFRESH_PATH, {
    auth: false,
    method: 'POST',
    retryOnUnauthorized: false,
  })
    .then((response) => {
      setAccessToken(response.accessToken);
      return response.accessToken;
    })
    .catch((error: unknown) => {
      clearAccessToken();
      throw error;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

async function request<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const shouldRetry =
    options.auth !== false &&
    options.retryOnUnauthorized !== false &&
    path !== REFRESH_PATH;

  try {
    return await requestRaw<TResponse>(path, options);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !shouldRetry) {
      throw error;
    }

    await refreshAccessToken();
    return requestRaw<TResponse>(path, { ...options, retryOnUnauthorized: false });
  }
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  setAccessToken(null);
}

export const apiClient = {
  delete: <TResponse>(path: string, options?: ApiRequestOptions) =>
    request<TResponse>(path, { ...options, method: 'DELETE' }),
  get: <TResponse>(path: string, options?: ApiRequestOptions) =>
    request<TResponse>(path, { ...options, method: 'GET' }),
  patch: <TResponse>(path: string, body?: RequestBody, options?: ApiRequestOptions) =>
    request<TResponse>(path, { ...options, body, method: 'PATCH' }),
  post: <TResponse>(path: string, body?: RequestBody, options?: ApiRequestOptions) =>
    request<TResponse>(path, { ...options, body, method: 'POST' }),
  put: <TResponse>(path: string, body?: RequestBody, options?: ApiRequestOptions) =>
    request<TResponse>(path, { ...options, body, method: 'PUT' }),
  request,
};
