import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request, // req is not being used but we need to take it because the params is only available in the second argument so it is a convention
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", {
        status: 400,
      });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } } // params alway need to be the second parameter.
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("imageUrl is required", {
        status: 400,
      });
    }

    if (!imageUrl) {
      return new NextResponse("imageUrl is required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", {
        status: 400,
      });
    }

    if (!params.billboardId) {
      return new NextResponse("billboard ID is required", {
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
    const store = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(store);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request, // req is not being used but we need to take it because the params is only available in the second argument so it is a convention
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", {
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    //I do not have to incitive with new NextResponse because I'll use NextResponse.json()
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
