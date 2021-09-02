import * as yup from "yup";
import { nanoid } from "nanoid";
import { schemaVersion } from "./schemaVersion";

export const SkappSchema = yup.object({
  id: yup
    .string()
    .required()
    .default(() => nanoid()),
  skylink: yup.string().length(46).required(),
  resolverSkylink: yup.string().optional(),
  addedOn: yup
    .date()
    .required()
    .default(() => new Date()),
  skylinkHistory: yup
    .array(
      yup.object({
        until: yup.date().default(() => new Date()),
        skylink: yup.string().required(),
      })
    )
    .ensure(),
  metadata: yup
    .object({
      name: yup.string().required().default("Unnamed Skapp"),
      description: yup.string(),
      icon: yup.string(),
    })
    .required(),
});

export const SkappsSchema = yup.object({
  schemaVersion: yup.string(schemaVersion).default(schemaVersion),
  element: yup.array(SkappSchema).ensure(),
});
