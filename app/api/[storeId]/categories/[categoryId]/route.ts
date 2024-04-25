import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, // req is not being used but we need to take it because the params is only available in the second argument so it is a convention
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category ID is required", {
        status: 400,
      });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } } // params alway need to be the second parameter.
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", {
        status: 400,
      });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", {
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

    // using deleteMany because userId in not unique
    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request, // req is not being used but we need to take it because the params is only available in the second argument so it is a convention
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", {
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
