// Utility functions for handling async operations in Next.js 16

/**
 * Safely resolve params in Server Components
 * Use this for dynamic routes: /product/[slug], /order/[orderId], etc.
 */
export async function resolveParams<T extends Record<string, any>>(
  params: Promise<T> | T
): Promise<T> {
  if (params instanceof Promise) {
    return await params;
  }
  return params;
}

/**
 * Safely resolve searchParams in Server Components
 */
export async function resolveSearchParams(
  searchParams: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>
): Promise<Record<string, string | string[] | undefined>> {
  if (searchParams instanceof Promise) {
    return await searchParams;
  }
  return searchParams;
}

/**
 * Type-safe param getter for Server Components
 */
export async function getParam<T extends Record<string, any>>(
  params: Promise<T>,
  key: keyof T
): Promise<T[keyof T]> {
  const resolved = await resolveParams(params);
  return resolved[key];
}

/**
 * Type-safe searchParam getter for Server Components
 */
export function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = searchParams[key];
  return typeof value === 'string' ? value : undefined;
}

/**
 * Format error messages for client display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Retry async operations with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxAttempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs * Math.pow(2, attempt - 1))
        );
      }
    }
  }

  throw lastError || new Error('Retry failed');
}
