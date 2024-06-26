import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const {
      name,
      images,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", {
        status: 400,
      });
    }
    if (!images || !images.length) {
      return new NextResponse("images is required", {
        status: 400,
      });
    }
    if (!price) {
      return new NextResponse("price is required", {
        status: 400,
      });
    }
    if (!categoryId) {
      return new NextResponse("categoryId is required", {
        status: 400,
      });
    }
    if (!colorId) {
      return new NextResponse("colorId is required", {
        status: 400,
      });
    }
    if (!sizeId) {
      return new NextResponse("sizeId is required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", {
        status: 400,
      });
    }

    // now before this operation I need to make sure that that this store belongs to the user.
    const store = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    });

    if (!store) {
      return new NextResponse("Unauthorized", {
        status: 403,
      });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,

        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCTS_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") || undefined;
  const colorId = searchParams.get("colorId") || undefined;
  const sizeId = searchParams.get("sizeId") || undefined;
  const isFeatured = searchParams.get("isFeatured") || undefined;

  try {
    const { userId } = auth();
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined, //  we do not want to pass false, sending undefined is good in this case => it will completely ignore this field. any value user send will be considered as true.
        isArchived: false, // archived is always will be false we will not load any product that is archived.
      },
      include: { // including all the relationships 
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log(`[PRODUCT_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
