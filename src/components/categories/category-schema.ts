import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
    type: z.enum(["income", "expense"], { message: "Tipe wajib dipilih" }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;