import { NotFoundError } from '../utils/errors';

type VersionStrategy = 'url' | 'header';

interface VersionConfig {
  strategy: VersionStrategy;
  supported: string[];
  default: string;
}

export class ApiVersioning {
  constructor(private config: VersionConfig) {}

  middleware = async (req: Request): Promise<string> => {
    let version: string | null = null;

    if (this.config.strategy === 'url') {
      const url = new URL(req.url);
      const match = url.pathname.match(/^\/v(\d+)/);
      version = match ? `v${match[1]}` : null;
    } else {
      version = req.headers.get('x-api-version');
    }

    version = version || this.config.default;

    if (!this.config.supported.includes(version)) {
      throw new NotFoundError(`API version ${version} is not supported`);
    }

    return version;
  };
}