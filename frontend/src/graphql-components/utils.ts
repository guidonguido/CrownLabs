import {
  ItPolitoCrownlabsV1alpha1Tenant,
  ItPolitoCrownlabsV1alpha2Instance,
  ItPolitoCrownlabsV1alpha2Template,
  Role,
} from '../generated-types';
import { someKeysOf } from '../utils';

function beautifyGqlResponse(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    let newArray: Array<any> = [];
    obj.forEach((e: any) => newArray.push(beautifyGqlResponse(e)));
    return newArray;
  }

  let newObj: any = {};
  const keys: any = Object.keys(obj);
  keys.forEach((key: any) => {
    let tmp: any = beautifyGqlResponse(obj[key]);
    if (typeof tmp !== 'object' || tmp === null || Array.isArray(tmp)) {
      newObj[key] = tmp;
    } else {
      const keysTmp: any = Object.keys(tmp);
      keysTmp.forEach((keyTmp: any) => {
        newObj[keyTmp] = tmp[keyTmp];
      });
    }
  });
  return newObj;
}

function getInstancePatchJson(spec: {
  prettyName?: string;
  running?: boolean;
}): string {
  let patchJson: ItPolitoCrownlabsV1alpha2Instance = {
    kind: 'Instance',
    apiVersion: 'crownlabs.polito.it/v1alpha2',
    spec,
  };
  return JSON.stringify(patchJson);
}

function getTemplatePatchJson(
  patchJson: someKeysOf<ItPolitoCrownlabsV1alpha2Template>
): string {
  return JSON.stringify({
    ...patchJson,
    kind: 'Template',
    apiVersion: 'crownlabs.polito.it/v1alpha2',
  });
}

function getTenantPatchJson(
  spec: {
    email?: string;
    firstName?: string;
    lastName?: string;
    publicKeys?: [string];
  },
  workspaces?: {
    role: Role;
    name: string;
  }[]
): string {
  let patchJson: ItPolitoCrownlabsV1alpha1Tenant = {
    kind: 'Tenant',
    apiVersion: 'crownlabs.polito.it/v1alpha1',
    spec: {
      ...spec,
      workspaces: workspaces?.map(({ role, name }) => ({
        role,
        workspaceRef: { name },
      })),
    },
  };
  return JSON.stringify(patchJson);
}

export {
  beautifyGqlResponse,
  getInstancePatchJson,
  getTemplatePatchJson,
  getTenantPatchJson,
};
