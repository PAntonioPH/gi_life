import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import process from "process";
import {jwtVerify} from "jose";
import {pagesSidebar} from "@/data/pagesSidebar";
import {message} from "@/utils/functions";

const {NEXT_PUBLIC_SECRET, NEXT_PUBLIC_TOKEN_WEB, NEXT_PUBLIC_TOKEN_MOBILE} = process.env

export const middleware = async (req: NextRequest, res: NextResponse) => {
  try {
    if (req.url.includes("/api")) {
      if (req.url.includes("/api/ping")) return NextResponse.next();

      const authHeader = req.headers.get("Authorization");
      if (authHeader === NEXT_PUBLIC_TOKEN_WEB || authHeader === NEXT_PUBLIC_TOKEN_MOBILE) return NextResponse.next();
      return new NextResponse(JSON.stringify(message("Authentication failed")), {status: 401, headers: {'content-type': 'application/json'}})
    }

    const jwt = req.cookies.get("tokenAuth");

    if (req.url.includes("/auth/login") && !jwt) return NextResponse.next();

    if (!jwt) return NextResponse.redirect(new URL("/auth/login", req.url));

    const {payload} = await jwtVerify(
      jwt.value,
      new TextEncoder().encode(NEXT_PUBLIC_SECRET)
    );

    let tempPagesSidebar: any[] = [];

    switch (payload.id_rol) {
      case 1:
        tempPagesSidebar = pagesSidebar.filter((page) => page.admin)
        break;
      case 2:
        tempPagesSidebar = pagesSidebar.filter((page) => page.editor)
        break;
    }

    return tempPagesSidebar.find((page) => req.url.includes(page.dir)) ? NextResponse.next() : NextResponse.redirect(new URL(tempPagesSidebar[0].dir, req.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
};

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"]
}