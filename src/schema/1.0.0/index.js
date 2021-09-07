import * as yup from "yup";
import { nanoid } from "nanoid";

export const schemaVersion = "1.0.0";

export const DappSchema = yup.object({
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
  favorite: yup.boolean().default(false),
  metadata: yup
    .object({
      name: yup.string().required().default("no name"),
      description: yup.string(),
      icon: yup.string(),
    })
    .required(),
});

export const Schema = yup
  .object({
    schemaVersion: yup.string(schemaVersion).default(schemaVersion),
    elements: yup.array(DappSchema).ensure(),
  })
  .strict(true);
