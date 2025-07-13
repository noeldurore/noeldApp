import { cloneDeep } from 'lodash';

type VersionedData = {
  meta: { version: number };
  data: Record<string, unknown>;
};

export const version = 123;

export async function migrate(originalVersionedData: VersionedData): Promise<VersionedData> {
  const versionedData = cloneDeep(originalVersionedData);
  versionedData.meta.version = version;
  return transformState(versionedData.data);
}

function transformState(state: Record<string, any>) {
  const preferencesControllerState = state?.PreferencesController;

  if (preferencesControllerState?.preferences) {
    preferencesControllerState.preferences.showConfirmationAdvancedDetails =
      Boolean(preferencesControllerState.useNonceField) ||
      Boolean(preferencesControllerState.featureFlags?.sendHexData);
  }

  return state;
}
