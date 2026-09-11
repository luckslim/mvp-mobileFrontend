type ResolveApiUrlOptions = {
  configuredApiUrl?: string;
  expoHostUri?: string;
  platform: string;
};

function getExpoHost(hostUri: string | undefined) {
  if (!hostUri) {
    return undefined;
  }

  const host = hostUri
    .replace(/^[a-z][a-z\d+.-]*:\/\//i, '')
    .split('/')[0];

  if (host.startsWith('[')) {
    return host.slice(0, host.indexOf(']') + 1);
  }

  return host.split(':')[0];
}

function replaceLoopbackHost(apiUrl: string, developmentHost: string) {
  return apiUrl.replace(
    /^(https?:\/\/)(localhost|127\.0\.0\.1|::1|\[::1\])(?=[:/]|$)/i,
    `$1${developmentHost}`,
  );
}

export function resolveApiUrl({
  configuredApiUrl,
  expoHostUri,
  platform,
}: ResolveApiUrlOptions) {
  const developmentHost = getExpoHost(expoHostUri);
  const defaultApiUrl = developmentHost && developmentHost !== 'localhost'
    ? `http://${developmentHost}:3333`
    : platform === 'android'
      ? 'http://10.0.2.2:3333'
      : 'http://localhost:3333';

  const configuredUrl = configuredApiUrl?.trim();

  if (!configuredUrl) {
    return defaultApiUrl;
  }

  if (developmentHost && developmentHost !== 'localhost') {
    return replaceLoopbackHost(configuredUrl, developmentHost);
  }

  return configuredUrl;
}
