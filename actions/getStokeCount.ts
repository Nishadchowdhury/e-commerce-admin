import prismadb from "@/lib/prismadb";

export const getStokeCount = async (storeId: string) => {
  const stokeCount = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false
    },
  });

  return stokeCount
};
