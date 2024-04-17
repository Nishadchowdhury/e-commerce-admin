import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, // req is not being used but we need to take it because the params is only available in the second argument so it is a convention
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size ID is required", {
        status: 400,
      });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } } // params alway need to be the second parameter.
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value ID is required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", {
        status: 400,
      });
    }

    if (!params.sizeId) {
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
    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request, // req is not being used but we need to take it because the params is only available in the second argument so it is a convention
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size ID is required", {
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
