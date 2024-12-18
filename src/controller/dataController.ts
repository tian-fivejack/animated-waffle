import { RequestHandler } from "express";
import prismaClient from "../client/prisma";

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
  }

  const fob =
    Number(data.nilai) +
    Number(data.biaya_tambahan) +
    Number(data.biaya_pengurangan) +
    +Number(data.voluntary_declaration);
  const cif = fob + Number(data.nilai_asuransi) + Number(data.freight);

  const created = await prismaClient.dataPungutan.create({
    data: { fob: String(fob), id_aju: data.id_aju, cif: String(cif) },
  });
  res.status(200).json(created);
};
