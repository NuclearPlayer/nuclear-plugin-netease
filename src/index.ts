import type {
  NuclearPlugin,
  NuclearPluginAPI,
} from '@nuclearplayer/plugin-sdk';

import { config } from './config';
import { createMetadataProvider } from './metadata-provider';
import { createStreamingProvider } from './streaming-provider';

const plugin: NuclearPlugin = {
  onEnable(api: NuclearPluginAPI) {
    api.Providers.register(createMetadataProvider(api));
    api.Providers.register(createStreamingProvider(api));
  },

  onDisable(api: NuclearPluginAPI) {
    api.Providers.unregister(config.metadataProviderId);
    api.Providers.unregister(config.streamingProviderId);
  },
};

export default plugin;
