import * as yup from "yup";
import { nanoid } from "nanoid";

export const schemaVersion = "1.0.0";

export const IdSchema = yup.string().default(() => nanoid());
export const CurrentDateSchema = yup.date().default(() => new Date());
export const SkylinkSchema = yup.string().length(46);

export const DappSchema = yup.object({
  id: IdSchema.required(),
  skylink: SkylinkSchema.required(),
  skylinks: yup
    .array(
      yup.object({
        skylink: SkylinkSchema.required(),
        addedOn: CurrentDateSchema,
      })
    )
    .ensure(),
  resolverSkylink: SkylinkSchema.optional(),
  addedOn: CurrentDateSchema.required(),
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
