import { RequestHandler } from "express";
import prismaClient from "../client/prisma";

const createEntry = async (fob: string, cif: string, idAju: string) => {
  const existingEntry = await prismaClient.dataPungutan.findUnique({
    where: { id_aju: idAju },
  });

  if (existingEntry) {
    throw new Error("Entry with the same id_aju already exists");
  }

  return await prismaClient.dataPungutan.create({
    data: { fob, id_aju: idAju, cif },
  });
};

const updateEntry = async (
  id: string,
  fob: string,
  cif: string,
  idAju: string
) => {
  const existingEntry = await prismaClient.dataPungutan.findUnique({
    where: { id_aju: idAju },
  });

  if (existingEntry) {
    throw new Error("Entry with the same id_aju already exists");
  }

  return await prismaClient.dataPungutan.update({
    where: { id: Number(id) },
    data: { fob, id_aju: idAju, cif },
  });
};

export const postDataPungutan: RequestHandler = async (req, res) => {
  const data = req.body;

  const mandatoryKeys = [
    "id_aju",
    "nilai",
    "biaya_tambahan",
    "biaya_pengurangan",
    "voluntary_declaration",
    "freight",
    "nilai_asuransi",
    "fob",
    "cif",
  ];
  const emptyKeys: string[] = [];

  mandatoryKeys.forEach((key) => {
    if (!data[key]) {
      emptyKeys.push(key);
    }
  });

  if (emptyKeys.length > 0) {
    res
      .status(400)
      .json({ error: `Keys cannot be empty: ${emptyKeys.join(", ")}` });
    return;
  }

  const fob =
    Number(data.nilai) +
    Number(data.biaya_tambahan) -
    Number(data.biaya_pengurangan) +
    +Number(data.voluntary_declaration);
  if (fob !== Number(data.fob)) {
    res.status(400).json({ error: "fob not match" });
    return;
  }

  const cif = fob + Number(data.nilai_asuransi) + Number(data.freight);
  if (cif !== Number(data.cif)) {
    res.status(400).json({ error: "cif not match" });
    return;
  }

  try {
    const entry = data.id
      ? await updateEntry(data.id, String(fob), String(cif), data.id_aju)
      : await createEntry(String(fob), String(cif), data.id_aju);

    res.status(data.id ? 200 : 201).json({ ...entry, id: String(entry.id) });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      if (error.message === "Entry with the same id_aju already exists") {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: `Unhandled Error: ${error.message}` });
      }
    } else {
      console.error("An unknown error occurred:", error);
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};
