import * as yup from "yup";
import { schemaVersion } from "./schemaVersion";
import { DappSchema } from "./DappsSchema";

export const GridGroupsSchema = yup
  .array(
    yup.object({
      order: yup.array(yup.reach(DappSchema, "id")).ensure(),
      favorites: yup.array(yup.reach(DappSchema, "id")).ensure(),
    })
  )
  .ensure();

export const GridSchema = yup.object({
  schemaVersion: yup.string(schemaVersion).default(schemaVersion),
  element: GridGroupsSchema,
});
