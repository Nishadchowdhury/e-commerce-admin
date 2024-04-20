import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, // req is not being used but we need to take it because the params is only available in the second argument so it is a convention
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("product ID is required", {
        status: 400,
      });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } } // params alway need to be the second parameter.
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
      return new NextResponse("Unauthorized", { status: 401 });
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

    if (!params.productId) {
      return new NextResponse("product ID is required", {
        status: 400,
      });
    }

    const storeById = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    });

    if (!storeById) {
      return new NextResponse("Unauthorized", {
        status: 403,
      });
    }

    prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        images: {
          deleteMany: {},
        },
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request, // req is not being used but we need to take it because the params is only available in the second argument so it is a convention
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("product ID is required", {
        status: 400,
      });
    }

    const storeById = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    });

    if (!storeById) {
      return new NextResponse("Unauthorized", {
        status: 403,
      });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
