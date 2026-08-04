import { create } from "zustand";
import type { UtilsState } from "../types/utils.types";
import { createCepSlice } from "./slices/cep.slice";
import { createPermissionsNavigationSlice } from "./slices/permissionsNavigation.slice";
import { createReferenceDataSlice } from "./slices/referenceData.slice";
import { createTimingSlice } from "./slices/timing.slice";

export const useUtilsStore = create<UtilsState>()((...a) => ({
  ...createReferenceDataSlice(...a),
  ...createCepSlice(...a),
  ...createPermissionsNavigationSlice(...a),
  ...createTimingSlice(...a),
}));
